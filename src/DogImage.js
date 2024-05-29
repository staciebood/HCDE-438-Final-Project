import { useEffect } from 'react';

/* used chat gpt to debug*/ 

const DogImage = ({ breed, setDogImage, setError }) => {
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(`https://dog.ceo/api/breeds/image/random`);
        if (!response.ok) {
          throw new Error('Failed to fetch random image');
        }
        const data = await response.json();
        setDogImage(data.message);
        setError('');
      } catch (error) {
        console.error('Error fetching random dog image:', error);
        setError('Failed to fetch random image. Please try again.');
      }
    };
    fetchRandomImage();
  }, [setDogImage, setError]);

  useEffect(() => {
    const fetchBreedImage = async () => {
      if (!breed) {
        setError('Please enter a breed');
        return;
      }

      try {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        if (!response.ok) {
          throw new Error('Failed to fetch breed image');
        }
        const data = await response.json();
        setDogImage(data.message);
        setError('');
      } catch (error) {
        console.error('Error fetching dog image:', error);
        setError('Failed to fetch breed image. Please try again.');
      }
    };

    if (breed) {
      fetchBreedImage();
    }
  }, [breed, setDogImage, setError]);

  return null;
};

export default DogImage;

