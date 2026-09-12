-- ROLES ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('owner', 'admin')
  );
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Staff can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- PROFILES ------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ADDONS --------------------------------------------------------------
CREATE TYPE public.addon_status AS ENUM ('pending', 'changes_requested', 'published', 'rejected');

CREATE TABLE public.addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text,
  description text NOT NULL,
  author_name text NOT NULL,
  submitter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL,
  addon_type text NOT NULL,
  versions text[] NOT NULL DEFAULT '{}',
  addon_version text NOT NULL DEFAULT '1.0.0',
  file_size text,
  file_url text,
  cover_url text,
  requirements text[] NOT NULL DEFAULT '{}',
  installation text[] NOT NULL DEFAULT '{}',
  status public.addon_status NOT NULL DEFAULT 'pending',
  admin_hosted boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  downloads integer NOT NULL DEFAULT 0,
  viewers integer NOT NULL DEFAULT 0,
  rating_avg numeric(3,2) NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  review_note text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX addons_status_idx ON public.addons (status);
CREATE INDEX addons_category_idx ON public.addons (category);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addons TO authenticated;
GRANT SELECT ON public.addons TO anon;
GRANT ALL ON public.addons TO service_role;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER addons_touch BEFORE UPDATE ON public.addons
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Published addons are public" ON public.addons
  FOR SELECT USING (status = 'published');
CREATE POLICY "Submitters can read their own addons" ON public.addons
  FOR SELECT TO authenticated USING (submitter_id = auth.uid());
CREATE POLICY "Staff can read all addons" ON public.addons
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Users submit pending addons" ON public.addons
  FOR INSERT TO authenticated WITH CHECK (
    submitter_id = auth.uid()
    AND status = 'pending'
    AND downloads = 0 AND viewers = 0
    AND admin_hosted = false AND featured = false
    AND rating_count = 0
  );
CREATE POLICY "Staff can create addons" ON public.addons
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Submitters edit their unpublished addons" ON public.addons
  FOR UPDATE TO authenticated
  USING (submitter_id = auth.uid() AND status <> 'published')
  WITH CHECK (submitter_id = auth.uid() AND status IN ('pending', 'changes_requested'));
CREATE POLICY "Staff can edit any addon" ON public.addons
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete addons" ON public.addons
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- Non-staff may never change counters or ratings
CREATE OR REPLACE FUNCTION public.guard_addon_stats()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF current_setting('request.jwt.claims', true) IS NULL THEN
    RETURN NEW; -- server side / definer functions
  END IF;
  IF NOT public.is_staff(auth.uid()) THEN
    NEW.downloads := OLD.downloads;
    NEW.viewers := OLD.viewers;
    NEW.rating_avg := OLD.rating_avg;
    NEW.rating_count := OLD.rating_count;
    NEW.admin_hosted := OLD.admin_hosted;
    NEW.featured := OLD.featured;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER addons_guard_stats BEFORE UPDATE ON public.addons
  FOR EACH ROW EXECUTE FUNCTION public.guard_addon_stats();

-- SCREENSHOTS ---------------------------------------------------------
CREATE TABLE public.addon_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addon_screenshots TO authenticated;
GRANT SELECT ON public.addon_screenshots TO anon;
GRANT ALL ON public.addon_screenshots TO service_role;
ALTER TABLE public.addon_screenshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Screenshots of published addons are public" ON public.addon_screenshots
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.addons a WHERE a.id = addon_id
      AND (a.status = 'published' OR a.submitter_id = auth.uid() OR public.is_staff(auth.uid()))
  ));
CREATE POLICY "Owners and staff add screenshots" ON public.addon_screenshots
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.addons a WHERE a.id = addon_id
      AND (a.submitter_id = auth.uid() OR public.is_staff(auth.uid()))
  ));
CREATE POLICY "Owners and staff remove screenshots" ON public.addon_screenshots
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.addons a WHERE a.id = addon_id
      AND (a.submitter_id = auth.uid() OR public.is_staff(auth.uid()))
  ));

-- RATINGS -------------------------------------------------------------
CREATE TABLE public.addon_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stars smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (addon_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addon_ratings TO authenticated;
GRANT SELECT ON public.addon_ratings TO anon;
GRANT ALL ON public.addon_ratings TO service_role;
ALTER TABLE public.addon_ratings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER addon_ratings_touch BEFORE UPDATE ON public.addon_ratings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Ratings are publicly readable" ON public.addon_ratings
  FOR SELECT USING (true);
CREATE POLICY "Users rate as themselves" ON public.addon_ratings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own rating" ON public.addon_ratings
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users or staff delete a rating" ON public.addon_ratings
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.recalc_addon_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target uuid;
BEGIN
  target := COALESCE(NEW.addon_id, OLD.addon_id);
  UPDATE public.addons a
  SET rating_avg = COALESCE(sub.avg_stars, 0), rating_count = COALESCE(sub.n, 0)
  FROM (
    SELECT round(avg(stars)::numeric, 2) AS avg_stars, count(*) AS n
    FROM public.addon_ratings WHERE addon_id = target
  ) sub
  WHERE a.id = target;
  RETURN NULL;
END;
$$;
CREATE TRIGGER addon_ratings_recalc
  AFTER INSERT OR UPDATE OR DELETE ON public.addon_ratings
  FOR EACH ROW EXECUTE FUNCTION public.recalc_addon_rating();

-- ACTIVITY ------------------------------------------------------------
CREATE TABLE public.addon_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX addon_views_unique ON public.addon_views (addon_id, visitor_key);
GRANT ALL ON public.addon_views TO service_role;
ALTER TABLE public.addon_views ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.addon_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX addon_downloads_addon_idx ON public.addon_downloads (addon_id);
CREATE INDEX addon_downloads_user_idx ON public.addon_downloads (user_id);
GRANT SELECT ON public.addon_downloads TO authenticated;
GRANT ALL ON public.addon_downloads TO service_role;
ALTER TABLE public.addon_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own downloads" ON public.addon_downloads
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.record_addon_view(p_addon_id uuid, p_visitor_key text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE key text; inserted boolean := false;
BEGIN
  IF p_visitor_key IS NULL OR length(p_visitor_key) < 8 THEN RETURN; END IF;
  key := COALESCE(auth.uid()::text, 'guest:' || p_visitor_key);
  IF NOT EXISTS (SELECT 1 FROM public.addons WHERE id = p_addon_id AND status = 'published') THEN
    RETURN;
  END IF;
  INSERT INTO public.addon_views (addon_id, user_id, visitor_key)
  VALUES (p_addon_id, auth.uid(), key)
  ON CONFLICT (addon_id, visitor_key) DO NOTHING;
  IF FOUND THEN inserted := true; END IF;
  IF inserted THEN
    UPDATE public.addons SET viewers = viewers + 1 WHERE id = p_addon_id;
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.record_addon_view(uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_addon_download(p_addon_id uuid, p_visitor_key text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE key text;
BEGIN
  IF p_visitor_key IS NULL OR length(p_visitor_key) < 8 THEN RETURN; END IF;
  key := COALESCE(auth.uid()::text, 'guest:' || p_visitor_key);
  IF NOT EXISTS (SELECT 1 FROM public.addons WHERE id = p_addon_id AND status = 'published') THEN
    RETURN;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.addon_downloads
    WHERE addon_id = p_addon_id AND visitor_key = key
      AND created_at > now() - interval '6 hours'
  ) THEN
    RETURN;
  END IF;
  INSERT INTO public.addon_downloads (addon_id, user_id, visitor_key)
  VALUES (p_addon_id, auth.uid(), key);
  UPDATE public.addons SET downloads = downloads + 1 WHERE id = p_addon_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.record_addon_download(uuid, text) TO anon, authenticated;

-- Admin publish helper: seeds admin-hosted starting stats once
CREATE OR REPLACE FUNCTION public.publish_addon(p_addon_id uuid, p_admin_hosted boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE row_addon public.addons;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  SELECT * INTO row_addon FROM public.addons WHERE id = p_addon_id;
  IF row_addon.id IS NULL THEN RAISE EXCEPTION 'Add-on not found'; END IF;

  IF row_addon.published_at IS NOT NULL THEN
    UPDATE public.addons SET status = 'published' WHERE id = p_addon_id;
    RETURN;
  END IF;

  IF p_admin_hosted THEN
    UPDATE public.addons SET
      status = 'published',
      admin_hosted = true,
      published_at = now(),
      downloads = 123 + floor(random() * 65)::int,
      viewers = 217 + floor(random() * 203)::int
    WHERE id = p_addon_id;
  ELSE
    UPDATE public.addons SET
      status = 'published',
      published_at = now(),
      downloads = 0,
      viewers = 0
    WHERE id = p_addon_id;
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.publish_addon(uuid, boolean) TO authenticated;

-- REQUESTS ------------------------------------------------------------
CREATE TYPE public.request_status AS ENUM
  ('requested', 'under_consideration', 'in_development', 'completed', 'rejected');

CREATE TABLE public.addon_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  minecraft_version text NOT NULL,
  reference_url text,
  status public.request_status NOT NULL DEFAULT 'requested',
  official_response text,
  votes integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addon_requests TO authenticated;
GRANT SELECT ON public.addon_requests TO anon;
GRANT ALL ON public.addon_requests TO service_role;
ALTER TABLE public.addon_requests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER addon_requests_touch BEFORE UPDATE ON public.addon_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Requests are publicly readable" ON public.addon_requests
  FOR SELECT USING (true);
CREATE POLICY "Users create requests" ON public.addon_requests
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND status = 'requested' AND votes = 0);
CREATE POLICY "Staff manage requests" ON public.addon_requests
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete requests" ON public.addon_requests
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.request_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.addon_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (request_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.request_votes TO authenticated;
GRANT ALL ON public.request_votes TO service_role;
ALTER TABLE public.request_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read votes" ON public.request_votes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users vote as themselves" ON public.request_votes
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users remove their vote" ON public.request_votes
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.recalc_request_votes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target uuid;
BEGIN
  target := COALESCE(NEW.request_id, OLD.request_id);
  UPDATE public.addon_requests r
  SET votes = (SELECT count(*) FROM public.request_votes WHERE request_id = target)
  WHERE r.id = target;
  RETURN NULL;
END;
$$;
CREATE TRIGGER request_votes_recalc
  AFTER INSERT OR DELETE ON public.request_votes
  FOR EACH ROW EXECUTE FUNCTION public.recalc_request_votes();

-- REPORTS -------------------------------------------------------------
CREATE TYPE public.report_status AS ENUM ('open', 'reviewing', 'resolved');

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid REFERENCES public.addons(id) ON DELETE CASCADE,
  reported_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  details text,
  status public.report_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reporters and staff read reports" ON public.reports
  FOR SELECT TO authenticated USING (reported_by = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Users file reports" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (reported_by = auth.uid() AND status = 'open');
CREATE POLICY "Staff update reports" ON public.reports
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete reports" ON public.reports
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- FAVOURITES ----------------------------------------------------------
CREATE TABLE public.favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (addon_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.favourites TO authenticated;
GRANT ALL ON public.favourites TO service_role;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their favourites" ON public.favourites
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());