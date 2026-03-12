# Project Context: trendora-client

This is a Next.js based e-commerce client application. 

## Key Areas Discovered
- **Storefront `(root)`**:
  - `products/` (Browsing & details)
  - `cart/` (Shopping cart)
  - `checkout/` (Checkout flow)
  - `categories/` (Category browsing)
  - `wish-list/` (Saved items)
  - `about-us/` (Static page)

- **Dashboards `(dashboard)`**:
  - `admin/` (Administrative tools)
  - `customer/` (Customer account management)
  - `dashboard/` (General dashboard layout)

- **Components**:
  - `@dashboard`: Shared dashboard components (`admin`, `customer`, `charts`, `orders`, `products-overview`, `top-products`, `new-comments`)
  - `form-input`: Reusable form fields
  - `ui`: Shared UI elements

- **Architecture Details**:
  - Uses Redux for state management (`/redux`)
  - Organized with React Hooks (`/hooks`) and utility functions (`/utils`, `/lib`)
  - Uses `form-schema` for form validation
