//Bilder.jsx
import React, { useState, useEffect } from 'react';
import './Bilder.css';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'; 


const images = [
  {
    original: '/img/Hundar/1.jpg',
    thumbnail: '/img/Hundar/1.jpg',
  },
  {
    original: '/img/Hundar/2.png',
    thumbnail: '/img/Hundar/2.png',
  },
  {
    original: '/img/Hundar/3.png',
    thumbnail: '/img/Hundar/3.png',
  },
  {
    original: '/img/Hundar/4.png',
    thumbnail: '/img/Hundar/4.png',
  },
  {
    original: '/img/Hundar/5.png',
    thumbnail: '/img/Hundar/5.png',
  },
  {
    original: '/img/Hundar/6.png',
    thumbnail: '/img/Hundar/6.png',
  },
  {
    original: '/img/Hundar/7.png',
    thumbnail: '/img/Hundar/7.png',
  },
  {
    original: '/img/Hundar/8.png',
    thumbnail: '/img/Hundar/8.png',
  },
  {
    original: '/img/Hundar/9.png',
    thumbnail: '/img/Hundar/9.png',
  },
  {
    original: '/img/Hundar/16.png',
    thumbnail: '/img/Hundar/16.png',
  },
  {
    original: '/img/Hundar/12.png',
    thumbnail: '/img/Hundar/12.png',
  },
  {
    original: '/img/Hundar/13.png',
    thumbnail: '/img/Hundar/13.png',
  },
  {
    original: '/img/Hundar/15.png',
    thumbnail: '/img/Hundar/15.png',
  },
  {
    original: '/img/Hundar/17.png',
    thumbnail: '/img/Hundar/17.png',
  },
  {
    original: '/img/Hundar/18.png',
    thumbnail: '/img/Hundar/18.png',
  },
];




const MyGallery = () => {
  return (
    <ImageGallery 
    items={images}
    showFullscreenButton={true}
    showPlayButton={true}
    autoPlay={true}
    // Tid i millisekunder mellan varje bild i bildspelet
    slideInterval={3000} 
  />
);
 
};

export default MyGallery;





 
