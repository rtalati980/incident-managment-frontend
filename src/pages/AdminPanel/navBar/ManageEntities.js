import React, { useState, useEffect } from 'react';
import './edit2.css';

export default function ManageEntities() {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    fetch('http://localhost:5000/api/subcategories')
      .then(response => response.json())
      .then(data => setSubcategories(data))
      .catch(error => console.error('Error fetching subcategories:', error));
  }, []);

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    if (categoryName.trim() !== '') {
      if (editingCategoryId) {
        // Update existing category
        fetch(`http://localhost:5000/api/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryName }),
        })
          .then(response => response.json())
          .then(data => {
            setCategories(categories.map(category => category.id === editingCategoryId ? data : category));
            setCategoryName('');
            setEditingCategoryId(null);
          })
          .catch(error => console.error('Error:', error));
      } else {
        // Create new category
        fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryName }),
        })
          .then(response => response.json())
          .then(data => {
            setCategories([...categories, data]);
            setCategoryName('');
          })
          .catch(error => console.error('Error:', error));
      }
    }
  };

  const handleSubcategorySubmit = (event) => {
    event.preventDefault();
    if (subcategoryName.trim() !== '' && selectedCategoryId.trim() !== '') {
      if (editingSubcategoryId) {
        // Update existing subcategory
        fetch(`http://localhost:5000/api/subcategories/${editingSubcategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: subcategoryName, categoryId: selectedCategoryId }),
        })
          .then(response => response.json())
          .then(data => {
            setSubcategories(subcategories.map(subcategory => subcategory.id === editingSubcategoryId ? data : subcategory));
            setSubcategoryName('');
            setSelectedCategoryId('');
            setEditingSubcategoryId(null);
          })
          .catch(error => console.error('Error:', error));
      } else {
        // Create new subcategory
        fetch('http://localhost:5000/api/subcategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: subcategoryName, categoryId: selectedCategoryId }),
        })
          .then(response => response.json())
          .then(data => {
            setSubcategories([...subcategories, data]);
            setSubcategoryName('');
            setSelectedCategoryId('');
          })
          .catch(error => console.error('Error:', error));
      }
    }
  };

  const handleCategoryEdit = (id, name) => {
    setEditingCategoryId(id);
    setCategoryName(name);
  };

  const handleSubcategoryEdit = (id, name, categoryId) => {
    setEditingSubcategoryId(id);
    setSubcategoryName(name);
    setSelectedCategoryId(categoryId);
  };

  const handleCategoryDelete = (id) => {
    fetch(`http://localhost:5000/api/categories/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCategories(categories.filter(category => category.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubcategoryDelete = (id) => {
    fetch(`http://localhost:5000/api/subcategories/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='eit'>
      <div className='category-form'>
        <form className='add' onSubmit={handleCategorySubmit}>
          <div className='in'>
            <input 
              placeholder='Category Name' 
              value={categoryName} 
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className='sub'>
            <input type='submit' value={editingCategoryId ? 'Update' : 'Submit'} />
          </div>
        </form>
        <table className='location-table'>
          <thead>
            <tr>
              <th>Number</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => handleCategoryEdit(category.id, category.name)}>Edit</button>
                  <button onClick={() => handleCategoryDelete(category.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='subcategory-form'>
        <form className='add' onSubmit={handleSubcategorySubmit}>
          <div className='in'>
            <input 
              placeholder='Subcategory Name' 
              value={subcategoryName} 
              onChange={(e) => setSubcategoryName(e.target.value)}
            />
          </div>
          <div className='in'>
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value='' disabled>Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className='sub'>
            <input type='submit' value={editingSubcategoryId ? 'Update' : 'Submit'} />
          </div>
        </form>
        <table className='location-table'>
          <thead>
            <tr>
              <th>Number</th>
              <th>Subcategory Name</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
        {/*  <tbody>
            {subcategories.map((subcategory, index) => (
              <tr key={subcategory.id}>
                <td>{index + 1}</td>
                <td>{subcategory.name}</td>
                <td>{categories.find(category => category.id === subcategory.categoryId)?.name || 'Unknown'}</td>
                <td>
                  <button onClick={() => handleSubcategoryEdit(subcategory.id, subcategory.name, subcategory.categoryId)}>Edit</button>
                  <button onClick={() => handleSubcategoryDelete(subcategory.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    </div>
  );
}
