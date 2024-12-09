import { db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

// In a real application, you'd want to use a proper email service
// This is a simulation that stores emails in Firestore
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const emailData = {
      to: order.customer.email,
      subject: `Order Confirmation - #${order.id}`,
      template: 'order-confirmation',
      data: {
        orderNumber: order.id,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        orderDate: new Date().toLocaleDateString(),
        items: order.items,
        total: order.total,
        shippingAddress: {
          address: order.shipping.address,
          city: order.shipping.city,
          country: order.shipping.country,
          postalCode: order.shipping.postalCode
        }
      },
      sentAt: new Date()
    };

    await addDoc(collection(db, 'emails'), emailData);

    // Send welcome email with brewing guide
    const welcomeEmailData = {
      to: order.customer.email,
      subject: 'Welcome to Fauve Coffee - Your Brewing Guide',
      template: 'welcome-guide',
      data: {
        customerName: order.customer.firstName,
      },
      sentAt: new Date()
    };

    await addDoc(collection(db, 'emails'), welcomeEmailData);

  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};