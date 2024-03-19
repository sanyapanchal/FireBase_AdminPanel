// import React from "react";
// import { useForm } from "react-hook-form";
// import CloseIcon from "@mui/icons-material/Close";
// import { Box, Typography } from "@mui/material";
// import { IconButton } from "@mui/material";
// import { Grid } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import Swal from "sweetalert2";

// export default function AddForm({ closeEvent, setRows, rows }) {
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const docRef = await addDoc(collection(db, "Products"), {
//         Name: data.Name,
//         Price: Number(data.Price),
//         Category: data.Category,
//         Date: String(new Date().toLocaleDateString()),
//       });
//       const newProduct = {
//         id: docRef.id,
//         Name: data.Name,
//         Price: Number(data.Price),
//         Category: data.Category,
//         Date: String(new Date().toLocaleDateString()),
//       };
//       setRows([...rows, newProduct]); // Update the table with the new product
//       closeEvent();
//       Swal.fire("Submitted!!", "Your File has been submitted", "success");
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       Swal.fire("Error!", "An error occurred while adding the product", "error");
//     }
//   };

//   const categoryOptions = [
//     { value: "Electronics", label: "Electronics" },
//     { value: "Purses", label: "Purses" },
//     { value: "Glasses", label: "Glasses" },
//     { value: "MakeUp", label: "MakeUp" },
//   ];

//   return (
//     <>
//       <Box sm={{ m: 2 }} />
//       <Typography variant="h5" align="center">
//         Add Product
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
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import Swal from "sweetalert2";

export default function AddForm({ closeEvent, setRows, rows }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [images, setImages] = useState([]);

  const onSubmit = async (data) => {
    try {
      const imageUrls = await uploadImagesToStorage(images);
      
      const docRef = await addDoc(collection(db, "Products"), {
        Name: data.Name,
        Price: Number(data.Price),
        Category: data.Category,
        Date: String(new Date().toLocaleDateString()),
        Images: imageUrls // Save the list of image URLs to Firestore
      });
      const newProduct = {
        id: docRef.id,
        Name: data.Name,
        Price: Number(data.Price),
        Category: data.Category,
        Date: String(new Date().toLocaleDateString()),
        Images: imageUrls
      };
      setRows([...rows, newProduct]); // Update the table with the new product
      closeEvent();
      Swal.fire("Submitted!!", "Your File has been submitted", "success");
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire("Error!", "An error occurred while adding the product", "error");
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages([...images, ...files]);
  };

  const uploadImagesToStorage = async (images) => {
    const imageUrls = [];

    for (const image of images) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    return imageUrls;
  };

  const categoryOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Purses", label: "Purses" },
    { value: "Glasses", label: "Glasses" },
    { value: "MakeUp", label: "MakeUp" },
  ];

  return (
    <>
      <Box sm={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Product
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
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index + 1}`}
                  style={{ width: '50px', height: '50px', marginRight: '5px' }}
                />
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

