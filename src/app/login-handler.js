// src/app/api/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // Simple validation (replace with real authentication logic)
      if (email === 'test@example.com' && password === 'password') {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  