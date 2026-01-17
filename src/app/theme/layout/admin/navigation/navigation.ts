export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  // -------------------------
  // DASHBOARD
  // -------------------------
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/app/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },

  // -------------------------
  // EVENT MANAGEMENT
  // -------------------------
  {
    id: 'event-management',
    title: 'Event Management',
    type: 'group',
    icon: 'feather icon-file-text',
    children: [
      {
        id: 'events',
        title: 'Events',
        type: 'item',
        url: '/app/events',
        icon: 'feather icon-file-text'
      }
    ]
  },

  // -------------------------
  // MANAGEMENT
  // -------------------------
  {
    id: 'management',
    title: 'Management',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'management-collapse',
        title: 'Management',
        type: 'collapse',
        icon: 'feather icon-layers',
        children: [
          {
            id: 'admin-management',
            title: 'Admin Management',
            type: 'item',
            url: '/app/admin-management'
          },
          {
            id: 'employee-management',
            title: 'Employee Management',
            type: 'item',
            url: '/app/employee-management'
          },
          {
            id: 'hr-payroll-management',
            title: 'HR Payroll Management',
            type: 'item',
            url: '/app/hr-payroll-management'
          }
        ]
      }
    ]
  },

  // -------------------------
  // VEHICLE MANAGEMENT
  // -------------------------
  {
    id: 'vehicle',
    title: 'Vehicle Management',
    type: 'group',
    icon: 'fa fa-truck',
    children: [
      {
        id: 'vehicle-collapse',
        title: 'Vehicle Management',
        type: 'collapse',
        icon: 'fa fa-truck',
        children: [
          {
            id: 'add-vehicle',
            title: 'Add Vehicle',
            type: 'item',
            url: '/app/add-vehicle'
          },
          {
            id: 'bookings',
            title: 'Bookings',
            type: 'item',
            url: '/app/bookings'
          },
          {
            id: 'sales',
            title: 'Sale',
            type: 'item',
            url: '/app/sale'
          },
          {
            id: 'drivers',
            title: 'Drivers',
            type: 'item',
            url: '/app/drivers'
          },
          {
            id: 'purchase',
            title: 'Purchase',
            type: 'item',
            url: '/app/purchases'
          }
        ]
      }
    ]
  },

  // -------------------------
  // REPORTS
  // -------------------------
  {
    id: 'reports',
    title: 'Reports',
    type: 'group',
    icon: 'feather icon-server',
    children: [
      {
        id: 'reports-collapse',
        title: 'Reports',
        type: 'collapse',
        icon: 'feather icon-bar-chart-2',
        children: [
          {
            id: 'vehicle-booking-report',
            title: 'Vehicle Booking Report',
            type: 'item',
            url: '/app/vehicle-booking-reports'
          },
          {
            id: 'vehicle-sales-report',
            title: 'Vehicle Sales Report',
            type: 'item',
            url: '/app/vehicle-sales-reports'
          },
          {
            id: 'vehicle-purchase-report',
            title: 'Vehicle Purchase Report',
            type: 'item',
            url: '/app/vehicle-purchase-reports'
          },
          {
            id: 'driver-report',
            title: 'Driver Report',
            type: 'item',
            url: '/app/driver-reports'
          },
          {
            id: 'employee-report',
            title: 'Employee Report',
            type: 'item',
            url: '/app/employee-reports'
          }
        ]
      }
    ]
  },

  // -------------------------
  // AUTHENTICATION
  // -------------------------
  {
    id: 'pages',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign Up',
            type: 'item',
            url: '/auth/register',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign In',
            type: 'item',
            url: '/auth/login',
            target: true,
            breadcrumbs: false
          }
        ]
      }
    ]
  }
];
