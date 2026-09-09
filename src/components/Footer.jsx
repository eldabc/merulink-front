import React from 'react';

export default function Footer() {
    const currentDate = new Date();
    const fullYear = currentDate.getFullYear();
  return (
    <>
    <footer className="mt-8 footer-muted">Hotel Plaza Meru — {fullYear} V1.0 Beta </footer>
    </>
  );
}