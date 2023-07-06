import React, { useState } from 'react';

function Header({ onDelete }) {
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedSize, setSelectedSize] = useState('16');
  const [selectedEffect, setSelectedEffect] = useState('none');

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleEffectChange = (e) => {
    setSelectedEffect(e.target.value);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="header">
      <div className="header__group">
        <label>Font:</label>
        <select value={selectedFont} onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>
      <div className="header__group">
        <label>Size:</label>
        <select value={selectedSize} onChange={handleSizeChange}>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
        </select>
      </div>
      <div className="header__group">
        <label>Effect:</label>
        <select value={selectedEffect} onChange={handleEffectChange}>
          <option value="none">None</option>
          <option value="bold">Bold</option>
          <option value="italic">Italic</option>
          <option value="underline">Underline</option>
        </select>
      </div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Header;
