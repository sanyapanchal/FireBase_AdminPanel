// import React from "react";
// import { useForm } from "react-hook-form";
// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Typography } from "@mui/material";
// import { IconButton } from "@mui/material";
// import { Grid } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
// import { updateDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";
// import Swal from "sweetalert2";

// export default function EditForm({ closeEvent, setRows, rows, fid }) {
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm({
//     defaultValues: {
//       Name: fid.Name,
//       Price: fid.Price,
//       Category: fid.Category
//     }
//   });

//   const onSubmit = async (data) => {
//     try {
//       const productDocRef = doc(db, "Products", fid.id);
//       await updateDoc(productDocRef, {
//         Name: data.Name,
//         Price: Number(data.Price),
//         Category: data.Category,
//         Date: new Date().toLocaleDateString(),
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

//   const categoryOptions = [
//     { value: 'Electronics', label: 'Electronics' },
//     { value: 'Purses', label: 'Purses' },
//     { value: 'Glasses', label: 'Glasses' },
//     { value: 'MakeUp', label: 'MakeUp' },
//   ];

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
//               select
//               label="Category"
//               variant="outlined"
//               size="small"
//               fullWidth
//               {...register("Category", { required: "Category is required" })}
//             >
//               {categoryOptions.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//             {errors.Category && <Typography variant="body2" color="error">{errors.Category.message}</Typography>}
//           </Grid>
//           <Grid item xs={12}>
//             <Button variant="contained" type="submit">Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </>
//   );
// }


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import Swal from "sweetalert2";

export default function EditForm({ closeEvent, setRows, rows, fid }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      Name: fid.Name,
      Price: fid.Price,
      Category: fid.Category
    }
  });
  const [images, setImages] = useState(fid.Images || []);

  const onSubmit = async (data) => {
    try {
      const productDocRef = doc(db, "Products", fid.id);

      // Update images in Firestore if they have changed
      if (images !== fid.Images) {
        const updatedImageUrls = await uploadImagesToStorage(images);
        await updateDoc(productDocRef, { Images: updatedImageUrls });
      }

      await updateDoc(productDocRef, {
        Name: data.Name,
        Price: Number(data.Price),
        Category: data.Category,
        Date: new Date().toLocaleDateString()
      });

      // Update the rows array with the updated product
      const updatedRows = rows.map(row => {
        if (row.id === fid.id) {
          return {
            ...row,
            Name: data.Name,
            Price: Number(data.Price),
            Category: data.Category,
            Date: new Date().toLocaleDateString(),
            Images: images // Update images in rows
          };
        }
        return row;
      });
      setRows(updatedRows);

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

  const uploadImagesToStorage = async (images) => {
    const imageUrls = [];

    for (const image of images) {
      const file = await fetch(image).then(res => res.blob());
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    return imageUrls;
  };

  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Purses', label: 'Purses' },
    { value: 'Glasses', label: 'Glasses' },
    { value: 'MakeUp', label: 'MakeUp' },
  ];

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
              select
              label="Category"
              variant="outlined"
              size="small"
              fullWidth
              {...register("Category", { required: "Category is required" })}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {errors.Category && <Typography variant="body2" color="error">{errors.Category.message}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
              ))}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

