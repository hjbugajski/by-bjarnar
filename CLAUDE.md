# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Run development server with Turbopack
- `pnpm i:dev` - Run development server with Infisical environment variables
- `pnpm dev:clean` - Clean build artifacts and run development server

### Build & Production

- `pnpm build` - Build the Next.js application
- `pnpm i:build` - Build with Infisical environment variables
- `pnpm build:clean` - Clean build artifacts and rebuild
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run Next.js linter
- `pnpm lint:all` - Run all linters (Prettier, ESLint, Stylelint)
- `pnpm eslint` - Run ESLint check
- `pnpm eslint:fix` - Fix ESLint issues
- `pnpm prettier` - Check Prettier formatting
- `pnpm prettier:fix` - Fix Prettier formatting
- `pnpm stylelint` - Check CSS styling
- `pnpm stylelint:fix` - Fix CSS styling issues

### Payload CMS

- `pnpm migrate` - Run Payload database migrations
- `pnpm i:migrate` - Run migrations with Infisical
- `pnpm migrate:create` - Create a new migration
- `pnpm migrate:dev` - Clean migrations and create new ones for development
- `pnpm generate:types` - Generate TypeScript types from Payload schema
- `pnpm generate:importmap` - Generate import map for Payload admin

## Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **CMS**: Payload CMS 3.49 with PostgreSQL adapter
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript with strict type checking
- **Package Manager**: pnpm

### Key Architecture Patterns

1. **Dual-Layout Application**
   - `/app/(site)` - Public-facing website with navigation sidebar
   - `/app/(payload)` - Payload CMS admin interface

2. **Payload CMS Integration**
   - Collections: Pages, Articles, Clients, Forms, FormSubmissions, Images, Users
   - Globals: Navigation, Footer
   - S3-compatible storage (R2) for images
   - Nested documents plugin for hierarchical pages
   - Custom rich text editor with Lexical
   - Email integration via Resend

3. **Environment Management**
   - Uses @t3-oss/env-nextjs for type-safe environment variables
   - Infisical integration for secret management (all `i:*` commands)
   - Server and client environment variables separated in `/src/env/`

4. **Content Architecture**
   - Dynamic page routing with `[[...slug]]` catch-all
   - Live preview functionality for content editors
   - Reusable block components (button-link, featured, form, image)
   - Rich text rendering with custom converters

5. **Data Fetching**
   - Server-side data fetching with Payload's `getPayload`
   - Unstable cache for global data with tag-based revalidation
   - Revalidation hooks for cache management

6. **Form System**
   - Dynamic form builder with multiple field types
   - Server actions for form submission
   - Email notifications on submission
   - Form submission storage in database

## Important Notes

- Always use `pnpm` for package management
- Run linters before committing: `pnpm lint:all`
- Environment variables are managed through Infisical - use `i:*` commands for local development
- Payload types are auto-generated - run `pnpm generate:types` after schema changes
- The project uses CSS-in-JS patterns with Tailwind v4 and custom CSS modules
- All icons are custom React components in `/src/icons/`
