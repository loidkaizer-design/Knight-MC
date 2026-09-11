# Craft Hub

LightCraft — Full Project Plan

LightCraft is a Minecraft add-on library where users can discover, download, request, and submit add-ons, while admins review every submission before it becomes public.

6

1. Core Website

Landing Page

Based on your provided design reference:

 Dark black/purple visual style

 Minecraft imagery and 3D assets

 Sticky navigation

 Hero section:

LightCraft branding

 "Your Minecraft Add-on Library"

 Browse Add-ons CTA

 Submit Add-on CTA

 Featured add-ons

 Popular categories

 How LightCraft works

 Community/request section

 Final CTA

 Footer

Main Navigation

LightCraft logo | Browse | Categories | Requests | Submit | About | Search | Account

Desktop → full navigation
Tablet → compact navigation
Mobile → hamburger menu

2. Add-on Library

The main purpose of LightCraft.

Browse page

Users can:

 Search add-ons

 Filter by:

 Minecraft version

 Add-on type

 Category

 Popularity

 Newest

 Sort:

 Most downloaded

 Recently added

 Recently updated

 Highest rated

Categories

Example:

 ⚔️ Weapons

 🧱 Building

 🐉 Mobs

 🌎 World

 🎨 Textures

 🧙 Magic

 🚗 Vehicles

 🌱 Survival

 🎮 Gameplay

 🔧 Utility

 Other

3. Add-on Page

Every approved add-on gets its own page.

Example:

Dragon Expansion

Adds new dragons, items, weapons and structures to Minecraft Bedrock.

Information:

 Cover image

 Screenshots

 Description

 Creator

 Minecraft versions

 Add-on type

 File size

 Version

 Last updated

 Downloads

 Requirements

 Installation instructions

Main actions

Download

Request an update

Report

Add to favorites

4. Add-on Download System

The actual files will be stored through MixDrop.

Architecture

LightCraft
    │
    ├── Database
    │     ├── Add-on information
    │     ├── Creator
    │     ├── Version
    │     ├── Category
    │     ├── Status
    │     └── MixDrop file reference
    │
    └── MixDrop
          └── Actual add-on files

LightCraft doesn't need to store large add-on files on its own server.

MixDrop stores the actual file while LightCraft stores the metadata and references.

5. MixDrop Integration

Use the MixDrop API for:

Upload

Backend sends the uploaded file to:

ul.mixdrop.ag/api

and receives:

fileref

 file URL

 embed URL

LightCraft stores the fileref in the database.

Remote Upload

Admins can provide an external download URL and LightCraft can send it to MixDrop's Remote Upload endpoint.

File management

Potentially integrate:

 File info

 File move

 File duplicate

 File rename

 File removal

 Folder listing

 Folder creation

 Folder rename

Important

The MixDrop credentials must only exist on the server.

Use environment variables:

MIXDROP_EMAIL=...
MIXDROP_API_KEY=...

Do not put them in React/Next.js client code.

Also, because the API key was posted in this conversation, rotate it before using the integration.

6. User Submission System

Users can submit their own add-ons.

Submission form

Add-on Name
Description
Category
Minecraft Version
Add-on Version
Screenshots
File
Installation Instructions
Creator Name

Then:

Submit for Review

The submission becomes:

PENDING

It does not immediately appear in the public library.

7. Admin Review System

Admins get a dashboard containing:

Pending submissions

Dragon Expansion
Submitted by: User
Minecraft: 1.21.x
Category: Mobs

[Preview] [Approve] [Reject]

Admins can:

 Preview submission

 Download/test the file

 Edit metadata

 Approve

 Reject

 Request changes

 Delete

 Flag suspicious content

Approval flow

User submits
      ↓
Pending Review
      ↓
Admin checks file
      ↓
 ┌──────────────┐
 │              │
Approve       Reject
 │              │
 ↓              ↓
Published     Rejected

8. Add-on Request System

Users can request something that isn't available.

Request form

What add-on are you looking for?
Minecraft version:
Category:
Description:
Reference/link (optional):

Example:

"I want a Bedrock add-on that adds realistic trains."

Request page

Show:

 Most requested

 New requests

 Completed requests

 Number of people interested

Users can upvote/request interest in an existing request instead of creating duplicates.

9. Admin Request Management

Admins can:

 View requests

 Merge duplicates

 Mark as planned

 Mark as in progress

 Mark as completed

 Reject inappropriate requests

 Add an official response

Status:

Requested
   ↓
Under Consideration
   ↓
In Development
   ↓
Completed

10. Accounts

Users can optionally create accounts.

User dashboard

Users can see:

 Submitted add-ons

 Submission status

 Requests

 Favorites

 Download history

 Profile

Creator profile

Approved creators can have:

 Profile picture

 Username

 Bio

 Published add-ons

 Total downloads

11. Moderation & Security

Because users upload files, this is important.

Upload protection

 File-size limits

 Allowed file extensions

 MIME/type validation

 Malware/security scanning where feasible

 Filename sanitization

 Rate limiting

 Authentication for submissions

 Admin-only publishing

 Report system

API security

Never expose:

 MixDrop API key

 Database credentials

 Admin credentials

 Server secrets

Use server-side API routes.

12. Website Pages

Recommended structure:

/
├── Home
├── /addons
│   ├── Browse
│   └── /[addon]
├── /categories
│   └── /[category]
├── /requests
│   └── /[request]
├── /submit
├── /creators
│   └── /[creator]
├── /about
├── /login
├── /register
├── /dashboard
│
└── /admin
    ├── Dashboard
    ├── Submissions
    ├── Add-ons
    ├── Requests
    ├── Users
    └── Reports

13. Scroll & Navigation System

Implement your requested pinning throughout the site.

Landing page

Sticky header

position: sticky;
top: 0;

Header changes appearance after scrolling:

At top
↓
Transparent

After scrolling
↓
Dark background + subtle shadow

Floating CTA

Appears after leaving the hero:

                         ┌──────────────┐
                         │ Browse Add-ons│
                         └──────────────┘

20px from bottom/right.

Back to top

Appears after 300px.

Other pages

 Sticky top navigation

 Sticky documentation/TOC sidebar where useful

 Sticky related-content panel on large screens

 Reduced pinned elements on mobile

14. Responsive Design

Mobile — <768px

Keep only essential pinned elements:

 Sticky header

 Hamburger menu

 Back-to-top button

Hide/reduce:

 Side panels

 Progress indicators

 Secondary sticky widgets

Tablet — 768–1024px

 Sticky header

 Sidebar where appropriate

 Floating CTA

 Back-to-top

Desktop — >1024px

Full experience:

 Sticky header

 Sidebar navigation

 Optional progress indicator

 Related-content panel

 Floating CTA

 Back-to-top

15. Visual Design

Your reference should be the foundation rather than copying it exactly.

LightCraft design language

Colors

 Black

 Deep purple

 Violet

 Bright purple CTA

 White text

 Muted gray text

UI

 Rounded cards

 Soft purple glow

 Subtle gradients

 Minecraft screenshots

 Pixel-art elements

 Large typography

 Smooth hover animations

Overall feeling

Minecraft + modern SaaS + gaming community.

Not an old-fashioned Minecraft forum.

16. Recommended Tech Architecture

A practical MVP:

Frontend
Next.js
   │
   ├── Tailwind CSS
   ├── Responsive UI
   └── Animations
          │
          ▼
Backend
Next.js API / Server
          │
     ┌────┴─────┐
     ▼          ▼
 Database     MixDrop
     │
     ├── Users
     ├── Add-ons
     ├── Requests
     ├── Reviews
     └── Downloads

For the database, PostgreSQL would be a strong choice.

17. Database Structure

Users

id
username
email
password/auth provider
role
avatar
created_at

Add-ons

id
title
slug
description
creator_id
category
minecraft_version
addon_version
file_size
mixdrop_fileref
status
downloads
created_at
updated_at

Screenshots

id
addon_id
image_url
sort_order

Requests

id
title
description
minecraft_version
category
status
created_by
votes
created_at

Reports

id
addon_id
reported_by
reason
status
created_at

18. Download Tracking

When somebody downloads an add-on:

User
 ↓
LightCraft download endpoint
 ↓
Record download
 ↓
Redirect to MixDrop

This lets LightCraft maintain its own download counter instead of relying entirely on MixDrop statistics.

19. Admin Roles

Start with:

Owner

Everything.

Admin

 Review uploads

 Manage add-ons

 Manage requests

 Handle reports

Moderator

 Review reports

 Moderate comments/content

 Flag submissions

User

 Download

 Request

 Submit

 Favorite

 Report

20. MVP Development Order

Phase 1 — Foundation

 Set up LightCraft project

 Database

 Authentication

 Basic design system

 Responsive navigation

Phase 2 — Library

 Add-on database

 Browse page

 Search

 Categories

 Filters

 Add-on detail pages

Phase 3 — MixDrop

 Secure API integration

 File upload

 Remote upload

 File references

 Download redirects

 Download tracking

Phase 4 — Community

 User accounts

 Add-on submission

 Add-on requests

 Voting

 Creator profiles

Phase 5 — Administration

 Admin dashboard

 Submission review

 Approve/reject

 Request management

 Reports

 User management

Phase 6 — Polish

 Scroll pinning

 Animations

 Mobile optimization

 Loading states

 Error handling

 SEO

 Performance optimization

Phase 7 — Launch

 Domain

 Production deployment

 Environment variables

 Database backups

 Monitoring

 Security testing

 Initial add-on library

21. Final LightCraft User Journey

                 LIGHTCRAFT
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Browse      Request    Submit
          │          │          │
          ▼          ▼          ▼
       Add-on     Community   Pending
       Library     Request     Review
          │                      │
          ▼                      ▼
       Download               Admin
          │                   Approval
          ▼                      │
       MixDrop                   ▼
                              Published

The MVP in one sentence

LightCraft will be a modern, Minecraft-themed add-on marketplace/library where users can discover and download community add-ons, request missing ones, and submit their own creations for admin approval, with MixDrop handling the actual file storage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38167128-0bee-4ead-a75a-49a70a42e72f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
