# Web-Based Order Management and Tracking System for Happy Burger

## Group Members

- John Aaron Villamater
- Jefferson Rodriguez
- Kenneth Siblos
- John Mark Deola
- Josiah Nathaniel Rivera
- Renze Lester Poso

## Project Description

This project is a web-based order management and tracking system for a
burger shop named Happy Burger, built as a school project. It consists of two separate
frontend applications sharing the same data:

- **Customer App** — lets customers browse the menu, add items to a cart,
  check out, and track the status of their order in real time.
- **Admin App** — lets shop staff log in, view and manage orders, and
- update order statuses (Pending → Preparing → Ready →
  Completed)

The project is entirely frontend — there is no backend server or database.
All data (menu items and orders) is stored in the browser's `localStorage`
and shared between the two apps via a common storage layer, so an order
placed in the customer app is immediately visible to the admin app (and
vice versa for status updates), as long as both are open in the same
browser.

## Technology Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)
- Browser `localStorage` for data persistence (no backend, no database)

## Project Structure
```bash
Happy-Burger-Order-Management-and-Tracking-System/
├───admin-app/
│   ├───css/
│   └───js/
├───customer-app/        
│   ├───assets/
│   │   └───images/
│   ├───css/
│   └───js/              
└───shared/              #Shared storage layer and data models used by both apps
```
## Setup Instructions

### Run locally

Because `localStorage` is scoped per browser origin, opening the HTML
files directly via `file://` can behave inconsistently. Serve the project
with a simple local server from the project root instead:

```bash
# Clone the repo
git clone https://github.com/EyEyron64/Happy-Burger-Order-Management-and-Tracking-System.git
cd Happy-Burger-Order-Management-and-Tracking-System

# Option A: Python
python3 -m http.server 8000

# Option B: VS Code
# Right-click any .html file → "Open with Live Server"
```

Then open in your browser:
- Customer app: `http://localhost:8000/customer-app/index.html`
- Admin app: `http://localhost:8000/admin-app/index.html`

**Default admin login:** `admin` / `burger123`

## Known Limitations

- Data is stored only in the browser and will be lost if browser storage
  is cleared, and is not shared across different browsers or devices.
- Admin login is a hardcoded demo credential, not secure authentication
- Hosted on GitHub Pages
