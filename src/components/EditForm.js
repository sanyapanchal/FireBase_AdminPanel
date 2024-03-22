// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Typography } from "@mui/material";
// import { IconButton } from "@mui/material";
// import { Grid } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
// import { updateDoc, doc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../firebase";
// import Swal from "sweetalert2";

// export default function EditForm({ closeEvent, setRows, rows, fid }) {
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm({
//     defaultValues: {
//       Name: fid.Name,
//       Price: fid.Price,
//       Category: fid.Category
//     }
//   });
//   const [images, setImages] = useState(fid.Images || []);

//   const onSubmit = async (data) => {
//     try {
//       const productDocRef = doc(db, "Products", fid.id);
      
//       // Update images in Firestore if they have changed
//       if (images !== fid.Images) {
//         const updatedImageUrls = await uploadImagesToStorage(images);
//         await updateDoc(productDocRef, { Images: updatedImageUrls });
//       }

//       await updateDoc(productDocRef, {
//         Name: data.Name,
//         Price: Number(data.Price),
//         Category: data.Category,
//         Date: new Date().toLocaleDateString()
//       });

//       // Update the rows array with the updated product
//       const updatedRows = rows.map(row => {
//         if (row.id === fid.id) {
//           return {
//             ...row,
//             Name: data.Name,
//             Price: Number(data.Price),
//             Category: data.Category,
//             Date: new Date().toLocaleDateString(),
//             Images: images
//           };
//         }
//         return row;
//       });
//       setRows(updatedRows);

//       closeEvent();
//       Swal.fire("Updated!!", "Your File has been updated", "success");
//     } catch (error) {
//       console.error("Error updating document: ", error);
//       Swal.fire("Error!", "An error occurred while updating the product", "error");
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const imageUrls = files.map(file => URL.createObjectURL(file));
//     setImages(prevImages => [...prevImages, ...imageUrls]);
//   };

//   const uploadImagesToStorage = async (images) => {
//     const imageUrls = [];

//     for (const image of images) {
//       const file = await fetch(image).then(res => res.blob());
//       const storageRef = ref(storage, `images/${file.name}`);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       imageUrls.push(url);
//     }

//     return imageUrls;
//   };

//   return (
//     <>
//       <Box sm={{ m: 2 }} />
//       <Typography variant="h5" align="center">
//         Edit Product
//       </Typography>
//       <IconButton style={{ position: "absolute", top: "0", right: "0" }} onClick={closeEvent}>
//         <CloseIcon />
//       </IconButton>
//       <Box height={20} />
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               id="outlined-basic"
//               label="Name"
//               variant="outlined"
//               size="small"
//               fullWidth
//               {...register("Name", { required: "Name is required" })}
//             />
//             {errors.Name && <Typography variant="body2" color="error">{errors.Name.message}</Typography>}
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               id="outlined-basic"
//               label="Price"
//               variant="outlined"
//               size="small"
//               type="number"
//               fullWidth
//               {...register("Price", { required: "Price is required" })}
//             />
//             {errors.Price && <Typography variant="body2" color="error">{errors.Price.message}</Typography>}
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               id="outlined-basic"
//               label="Category"
//               variant="outlined"
//               size="small"
//               fullWidth
//               {...register("Category", { required: "Category is required" })}
//             />
//             {errors.Category && <Typography variant="body2" color="error">{errors.Category.message}</Typography>}
//           </Grid>
//           <Grid item xs={12}>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//             />
//             <div>
//               {images.map((image, index) => (
//                 <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
//               ))}
//             </div>
//           </Grid>
//           <Grid item xs={12}>
//             <Button variant="contained" type="submit">Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { updateDoc, doc, getDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import Swal from "sweetalert2";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function EditForm({ closeEvent, setRows, rows, fid }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      Name: fid.Name || "",
      Price: fid.Price || "",
      Category: fid.Category || ""
    }
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const productDoc = await getDoc(doc(db, "Products", fid.id));
        if (productDoc.exists()) {
          const data = productDoc.data();
          setExistingImages(data.Images || []);
          setImages(data.Images || []);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [fid.id]);

  // const onSubmit = async (data) => {
  //   try {
  //     if (images.length === 0) {
  //       Swal.fire("Error!", "Please select at least one image", "error");
  //       return;
  //     }

  //     const productDocRef = doc(db, "Products", fid.id);

  //     if (JSON.stringify(images) !== JSON.stringify(existingImages)) {
  //       const updatedImageUrls = await uploadImagesToStorage(images);
  //       await updateDoc(productDocRef, { 
  //         Images: updatedImageUrls
  //       });
  //     }

  //     await updateDoc(productDocRef, {
  //       Name: data.Name,
  //       Price: Number(data.Price),
  //       Category: data.Category,
  //       Date: new Date().toLocaleDateString()
  //     });

  //     const updatedRows = rows.map(row => {
  //       if (row.id === fid.id) {
  //         return {
  //           ...row,
  //           Name: data.Name,
  //           Price: Number(data.Price),
  //           Category: data.Category,
  //           Date: new Date().toLocaleDateString(),
  //           Images: images
  //         };
  //       }
  //       return row;
  //     });
  //     setRows(updatedRows);

  //     closeEvent();
  //     Swal.fire("Updated!!", "Your File has been updated", "success");
  //   } catch (error) {
  //     console.error("Error updating document: ", error);
  //     Swal.fire("Error!", "An error occurred while updating the product", "error");
  //   }
  // };
  const onSubmit = async (data) => {
    try {
      if (images.length === 0) {
        Swal.fire("Error!", "Please select at least one image", "error");
        return;
      }
  
      const productDocRef = doc(db, "Products", fid.id);
  
      let updatedImageUrls = [];
  
      // Check if images have been changed
      if (JSON.stringify(images) !== JSON.stringify(existingImages)) {
        // If changed, upload new images and combine with existing images
        const newImageUrls = await uploadImagesToStorage(images);
        updatedImageUrls = [...existingImages, ...newImageUrls];
      } else {
        // If not changed, retain existing images
        updatedImageUrls = existingImages;
      }
  
      // Update product document with new images
      await updateDoc(productDocRef, { 
        Images: updatedImageUrls
      });
  
      // Update other fields of product document
      await updateDoc(productDocRef, {
        Name: data.Name,
        Price: Number(data.Price),
        Category: data.Category,
        Date: new Date().toLocaleDateString()
      });
  
      // Update rows state with updated data
      const updatedRows = rows.map(row => {
        if (row.id === fid.id) {
          return {
            ...row,
            Name: data.Name,
            Price: Number(data.Price),
            Category: data.Category,
            Date: new Date().toLocaleDateString(),
            Images: updatedImageUrls
          };
        }
        return row;
      });
      setRows(updatedRows);
  
      // Close edit form and show success message
      closeEvent();
      Swal.fire("Updated!!", "Your File has been updated", "success");
    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire("Error!", "An error occurred while updating the product", "error");
    }
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...imageUrls]);
  };

  // const deleteImage = (index) => {
  //   const newImages = [...images];
  //   newImages.splice(index, 1);
  //   setImages(newImages);
  // };
  const deleteImage = async (index) => {
    try {
      // Remove the deleted image from the images state
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
  
      // Remove the deleted image URL from the existingImages state
      const newExistingImages = [...existingImages];
      const deletedImageUrl = newExistingImages.splice(index, 1)[0];
      setExistingImages(newExistingImages);
  
      // Delete the image from Firebase storage using the URL
      const storageRef = ref(storage, deletedImageUrl);
      await deleteObject(storageRef);
  
      // Show success message
      // Swal.fire("Deleted!!", "The image has been deleted", "success");
    } catch (error) {
      console.error("Error deleting image:", error);
      // Swal.fire("Error!", "An error occurred while deleting the image", "error");
    }
  };
  
  

  const uploadImagesToStorage = async (images) => {
    const imageUrls = [];

    for (const image of images) {
      try {
        const file = await fetch(image).then(res => res.blob());
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return imageUrls;
  };

  return (
    <>
      <Box sm={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Edit Product
      </Typography>
      <IconButton style={{ position: "absolute", top: "0", right: "0" }} onClick={closeEvent}>
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              size="small"
              fullWidth
              {...register("Name", { required: "Name is required" })}
            />
            {errors.Name && <Typography variant="body2" color="error">{errors.Name.message}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="Price"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              {...register("Price", { required: "Price is required" })}
            />
            {errors.Price && <Typography variant="body2" color="error">{errors.Price.message}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="Category"
              variant="outlined"
              size="small"
              fullWidth
              {...register("Category", { required: "Category is required" })}
            />
            {errors.Category && <Typography variant="body2" color="error">{errors.Category.message}</Typography>}
          </Grid>
          <Grid item xs={12} style={{ marginTop: "10px" }}>
            <div style={{ display: "flex" }}>
              {images.map((image, index) => (
                <div key={index} style={{ position: "relative", marginRight: "10px" }}>
                  <img src={image} alt={`Image ${index + 1}`} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0", background: "black", color:"white", borderRadius: "50%" , padding: "4px" ,
                    margin: "-4px", }}
                    onClick={() => deleteImage(index)}
                  >
                    <CloseIcon style={{ fontSize: "16px" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
