// import { useEffect, useState } from "react";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import { db, storage } from "../firebase"; // Assuming you have initialized Firebase storage
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Swal from "sweetalert2";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import Modal from '@mui/material/Modal';
// import AddForm from "./AddForm";
// import EditForm from "./EditForm";

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// export default function UsersList() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [rows, setRows] = useState([]);
//   const empCollectionRef = collection(db, "Products");
//   const [open, setOpen] = useState(false);
//   const [editopen, setEditOpen] = useState(false);
//   const [formId, setFormId] = useState(null);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = async () => {
//     const data = await getDocs(empCollectionRef);
//     setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleEditClose = () => {
//     setEditOpen(false);
//     setFormId(null);
//   };

//   const deleteUser = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteApi(id);
//       }
//     });
//   };

//   const deleteApi = async (id) => {
//     const userDoc = doc(db, "Products", id);
//     await deleteDoc(userDoc);
//     Swal.fire("Deleted!", "Your file has been deleted.", "success");
//     getUsers();
//   };

//   const filterData = (v) => {
//     if (v) {
//       setRows([v]);
//     } else {
//       getUsers();
//     }
//   };
 
  

//   const editData = (id, Name, Price, Category) => {
//     setFormId({ id, Name, Price, Category });
//     setEditOpen(true);
//   };

//   return (
//     <>
//       <div>
//         <Modal
//           open={open}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <AddForm closeEvent={() => setOpen(false)} setRows={setRows} rows={rows} />
//           </Box>
//         </Modal>

//         <Modal
//           open={editopen}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <EditForm
//               closeEvent={handleEditClose}
//               setRows={setRows}
//               rows={rows}
//               fid={formId}
//             />
//           </Box>
//         </Modal>
//       </div>

//       {rows.length > 0 && (
//         <Paper sx={{ width: "95%", overflow: "hidden", padding: "12px", margin: "40px" }}>
//           <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
//             Products List
//           </Typography>
//           <Divider />
//           <Box height={10} />
//           <Stack direction="row" spacing={2} className="my-2 mb-2">

//             <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               options={rows}
//               sx={{ width: 300 }}
//               onChange={(e, v) => filterData(v)}
//               getOptionLabel={(row) => row.Name || ""}
//               renderInput={(params) => (
//                 <TextField {...params} size="small" label="Search Products" />
//               )}
//             />



//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
//             <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => setOpen(true)}>
//               Add
//             </Button>
//           </Stack>
//           <Box height={10} />
//           <TableContainer>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                 <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Images
//                   </TableCell>
//                   <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Name
//                   </TableCell>
//                   <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Price
//                   </TableCell>
//                   <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Category
//                   </TableCell>
//                   <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Date
//                   </TableCell>
//                   <TableCell align="left" style={{ minWidth: "100px" }}>
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => {
//                     return (
//                       <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                         <TableCell align="left">
//                           {row.Images && row.Images.map((image, index) => (
//                             <img key={index} src={image} alt={`Image ${index + 1}`} style={{width: '50px', height: '50px', marginRight: '5px'}} />
//                           ))}
//                         </TableCell>
//                         <TableCell align="left">{row.Name}</TableCell>
//                         <TableCell align="left">{row.Price}</TableCell>
//                         <TableCell align="left">{row.Category}</TableCell>
//                         <TableCell align="left">{row.Date}</TableCell>
//                         <TableCell align="left">
//                           <Stack spacing={2} direction="row">
//                             <EditIcon
//                               style={{
//                                 fontSize: "20px",
//                                 color: "blue",
//                                 cursor: "pointer",
//                               }}
//                               className="cursor-pointer"
//                               onClick={() => editData(row.id, row.Name, row.Price, row.Category)}
//                             />
//                             <DeleteIcon
//                               style={{
//                                 fontSize: "20px",
//                                 color: "darkred",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => deleteUser(row.id)}
//                             />
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={rows.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>
//       )}
//     </>
//   );
// }


import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { db, storage } from "../firebase"; // Assuming you have initialized Firebase storage
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from '@mui/material/Modal';
import AddForm from "./AddForm";
import EditForm from "./EditForm";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UsersList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const empCollectionRef = collection(db, "Products");
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [formId, setFormId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noMatchFound, setNoMatchFound] = useState(false); 

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setFormId(null);
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, "Products", id);
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getUsers();
  };

 
  const filterData = () => {
    if (!searchTerm) {
      getUsers();
      return;
    }
  
    const filteredRows = rows.filter(row => {
      return row.Name.toLowerCase().includes(searchTerm.toLowerCase());
      // return row.Name.toLowerCase() === searchTerm.toLowerCase();
    });
  
    if (filteredRows.length === 0) {
      setNoMatchFound(true);
    } else {
      setRows(filteredRows);
      setNoMatchFound(false);
    }
  };

  
  const handleSearchInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (!value) {
      getUsers();
      setNoMatchFound(false); // Reset no match found status
    } else {
      filterData(); // Call filterData for non-empty search term
    }
  };
  


  const editData = (id, Name, Price, Category) => {
    setFormId({ id, Name, Price, Category });
    setEditOpen(true);
  };

  return (
    <>
      <div>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddForm closeEvent={() => setOpen(false)} setRows={setRows} rows={rows} />
          </Box>
        </Modal>

        <Modal
          open={editopen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditForm
              closeEvent={handleEditClose}
              setRows={setRows}
              rows={rows}
              fid={formId}
            />
          </Box>
        </Modal>
      </div>

      {rows.length > 0 && (
        <Paper sx={{ width: "95%", overflow: "hidden", padding: "12px", margin: "40px" }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
            Products List
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} className="my-2 mb-2">


            <TextField
              id="search"
              label="Search Products"
              size="small"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
            {noMatchFound && searchTerm && ( // Display message only if searchTerm is not empty
              <Typography variant="subtitle1" style={{ color: "red" }}>
                No match found
              </Typography>
            )}
            

        

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => setOpen(true)}>
              Add
            </Button>
          </Stack>
          <Box height={10} />
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                    Images
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Name
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Price
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Category
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Date
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: "100px" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell align="left">
                          {row.Images && row.Images.map((image, index) => (
                            <img key={index} src={image} alt={`Image ${index + 1}`} style={{width: '50px', height: '50px', marginRight: '5px'}} />
                          ))}
                        </TableCell>
                        <TableCell align="left">{row.Name}</TableCell>
                        <TableCell align="left">{row.Price}</TableCell>
                        <TableCell align="left">{row.Category}</TableCell>
                        <TableCell align="left">{row.Date}</TableCell>
                        <TableCell align="left">
                          <Stack spacing={2} direction="row">
                            <EditIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => editData(row.id, row.Name, row.Price, row.Category)}
                            />
                            <DeleteIcon
                              style={{
                                fontSize: "20px",
                                color: "darkred",
                                cursor: "pointer",
                              }}
                              onClick={() => deleteUser(row.id)}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
