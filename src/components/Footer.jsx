import React from 'react';

export default function Footer() {
    const currentDate = new Date();
    const fullYear = currentDate.getFullYear();
  return (
    <>
    <footer className="mt-6 footer-muted">Hotel Plaza Meru — V1.0 {fullYear} </footer>
    </>
  );
}