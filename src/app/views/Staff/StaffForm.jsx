import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {FieldArray, Form, Formik} from "formik";
import * as Yup from "yup";
import {InputLabel, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {observer} from "mobx-react";
import {useStore} from "../../stores";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    wapper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: theme.spacing(2),
        width: "100%",
        position: "relative", // Added for absolute positioning of button
    },
    itemInput: {
        width: "45%",
    },
    wapperButton: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
    },
    addFamilyMemberBtn: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#0056b3",
        },
    },
    familyMembersTable: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: theme.spacing(4), // Adds space between table and the button
    },
    tableHeader: {
        backgroundColor: "#f4f4f4",
    },
    tableCell: {
        border: "1px solid #ddd",
        padding: theme.spacing(1),
        textAlign: "left",
    },
    removeBtn: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "darkred",
        },
    },
}));


export default observer(function StaffForm() {
    const classes = useStyles();
    const {staffStore, departmentStore, countryStore, ethnicsStore, religionStore} = useStore();
    const {
        shouldOpenEditorDialog,
        setShouldOpenEditorDialog,
        selected,
        updateData,
        saveData
    } = staffStore;

    const initialValues = {
        id: selected?.id || "",
        firstName: selected?.firstName || "",
        lastName: selected?.lastName || "",
        displayName: "",
        gender: selected?.gender || "",
        birthDate: selected?.birthDate || "",
        birthPlace: selected?.birthPlace || "",
        permanentResidence: selected?.permanentResidence || "",
        currentResidence: selected?.currentResidence || "",
        email: selected?.email || "",
        phoneNumber: selected?.phoneNumber || "",
        idNumber: selected?.idNumber || "",
        nationality: selected?.nationality || null,
        ethnics: selected?.ethnics || null,
        religion: selected?.religion || null,
        department: selected?.department || null,
        familyRelationships: selected?.familyRelationships || [{
            fullName: "",
            profession: "",
            address: "",
            description: ""
        }],
    }
    const validationSchema = Yup.object
    ({
        // firstName: Yup.string()
        //     .min(2, "Ít nhất 2 ký tự")
        //     .max(50, "Tối đa 50 ký tự")
        //     .required("Không được bỏ trống!"),
        // lastName: Yup.string()
        //     .min(2, "Ít nhất 2 ký tự")
        //     .max(50, "Tối đa 50 ký tự")
        //     .required("Không được bỏ trống!"),
        // displayName: Yup.string()
        //     .min(2, "Ít nhất 2 ký tự")
        //     .max(100, "Tối đa 100 ký tự")
        //     .required("Không được bỏ trống!"),
        // gender: Yup.string()
        //     .oneOf(["M", "F", "U"], "Giới tính không hợp lệ")
        //     .required("Không được bỏ trống!"),
        // birthDate: Yup.date()
        //     .required("Ngày sinh không được bỏ trống!")
        //     .max(new Date(), "Ngày sinh không thể trong tương lai"),
        // birthPlace: Yup.string()
        //     .max(100, "Tối đa 100 ký tự")
        //     .required("Nơi sinh không được bỏ trống!"),
        // permanentResidence: Yup.string()
        //     .max(100, "Tối đa 100 ký tự")
        //     .required("Nơi cư trú thường xuyên không được bỏ trống!"),
        // currentResidence: Yup.string()
        //     .max(100, "Tối đa 100 ký tự")
        //     .required("Nơi cư trú hiện tại không được bỏ trống!"),
        // email: Yup.string()
        //     .email("Địa chỉ email không hợp lệ")
        //     .required("Không được bỏ trống!"),
        // phoneNumber: Yup.string()
        //     .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm 10 chữ số")
        //     .required("Không được bỏ trống!"),
        // idNumber: Yup.string()
        //     .matches(/^[0-9]{9}$/, "Số CMND phải gồm 9 chữ số")
        //     .required("Không được bỏ trống!"),
        // familyRelationships: Yup.array().of(
        //     Yup.object().shape({
        //         name: Yup.string().required("Required"),
        //         age: Yup.number().required("Required").min(1, "Invalid age"),
        //         relationship: Yup.string().required("Required")
        //     })
        // )
    })
    const onSubmit = async (values, {resetForm}) => {
        console.log(values)
        try {
            if (selected?.id) {
                updateData(values);
            } else {
                saveData(values);
            }
            resetForm();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    useEffect(() => {
        countryStore.setPageSize(200);
        departmentStore.setPageSize(200);
        ethnicsStore.getAllEthnic();
        religionStore.getAll();
    }, []);
    return (
        <Dialog
            open={shouldOpenEditorDialog}
            onClose={() => setShouldOpenEditorDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"md"}
        >
            <DialogTitle id="alert-dialog-title">
                {selected?.id ? "Edit Staff" : "Create Staff"}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}  // Use the onSubmit you defined
                >
                    {({
                          values,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          touched,
                          errors
                      }) => (
                        <Form>
                            <div className={classes.wapper}>
                                <TextField
                                    className={classes.itemInput}
                                    label="First Name"
                                    variant="outlined"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Last Name"
                                    variant="outlined"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Display Name"
                                    variant="outlined"
                                    name="displayName"
                                    value={values.lastName + " " + values.firstName}
                                    disabled
                                />
                                <FormControl className={classes.itemInput} variant="outlined">
                                    <InputLabel id="gender-select-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        id="gender-select"
                                        name="gender"
                                        value={values.gender}
                                        onChange={handleChange}
                                        label="Gender"
                                        error={touched.gender && Boolean(errors.gender)}
                                    >
                                        <MenuItem value={"F"}>Female</MenuItem>
                                        <MenuItem value={"M"}>Male</MenuItem>
                                        <MenuItem value={"U"}>Unknown</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    className={classes.itemInput}
                                    label="Birth Date"
                                    variant="outlined"
                                    name="birthDate"
                                    type="date"  // Cho phép chọn ngày
                                    value={values.birthDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{
                                        shrink: true,  // Đảm bảo nhãn luôn hiển thị khi chọn ngày
                                    }}
                                    error={touched.birthDate && Boolean(errors.birthDate)}
                                    helperText={touched.birthDate && errors.birthDate}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Birth Place"
                                    variant="outlined"
                                    name="birthPlace"
                                    value={values.birthPlace}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.birthPlace && Boolean(errors.birthPlace)}
                                    helperText={touched.birthPlace && errors.birthPlace}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Permanent Residence"
                                    variant="outlined"
                                    name="permanentResidence"
                                    value={values.permanentResidence}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.permanentResidence && Boolean(errors.permanentResidence)}
                                    helperText={touched.permanentResidence && errors.permanentResidence}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Current Residence"
                                    variant="outlined"
                                    name="currentResidence"
                                    value={values.currentResidence}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.currentResidence && Boolean(errors.currentResidence)}
                                    helperText={touched.currentResidence && errors.currentResidence}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="Phone Number"
                                    variant="outlined"
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                />
                                <TextField
                                    className={classes.itemInput}
                                    label="ID Number"
                                    variant="outlined"
                                    name="idNumber"
                                    value={values.idNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.idNumber && Boolean(errors.idNumber)}
                                    helperText={touched.idNumber && errors.idNumber}
                                />
                                <FormControl className={classes.itemInput} variant="outlined">
                                    <InputLabel id="nationality-select-label">Nationality</InputLabel>
                                    <Select
                                        labelId="nationality-select-label"
                                        id="nationality-select"
                                        name="nationality"
                                        value={values.nationality?.id || ''}
                                        onChange={(event) => {
                                            const selectedCountry = countryStore.countryList.find(
                                                (country) => country.id === event.target.value
                                            );
                                            handleChange({target: {name: 'nationality', value: selectedCountry}});
                                        }}
                                        label="Nationality"
                                        error={touched.nationality && Boolean(errors.nationality)}
                                    >
                                        {countryStore.countryList.map((country) => (
                                            <MenuItem key={country.id} value={country?.id}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.itemInput} variant="outlined">
                                    <InputLabel id="ethnics-select-label">Ethnics</InputLabel>
                                    <Select
                                        labelId="ethnics-select-label"
                                        id="ethnics-select"
                                        name="ethnics"
                                        value={values.ethnics?.id || ''}
                                        onChange={(event) => {
                                            const selectedEthnic = ethnicsStore.listData.find(
                                                (ethnic) => ethnic.id === event.target.value
                                            );
                                            handleChange({target: {name: 'ethnics', value: selectedEthnic}});
                                        }}
                                        label="Ethnics"
                                        error={touched.ethnics && Boolean(errors.ethnics)}
                                    >
                                        {ethnicsStore.listData.map((ethnic) => (
                                            <MenuItem key={ethnic.id} value={ethnic.id}>
                                                {ethnic.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.itemInput} variant="outlined">
                                    <InputLabel id="religion-select-label">Religion</InputLabel>
                                    <Select
                                        labelId="religion-select-label"
                                        id="religion-select"
                                        name="religion"
                                        value={values.religion?.id || ''}
                                        onChange={(event) => {
                                            const selectedReligion = religionStore.religionList.find(
                                                (religion) => religion.id === event.target.value
                                            );
                                            handleChange({target: {name: 'religion', value: selectedReligion}});
                                        }}
                                        label="Religion"
                                        error={touched.religion && Boolean(errors.religion)}
                                    >
                                        {religionStore.religionList.map((religion) => (
                                            <MenuItem key={religion.id} value={religion.id}>
                                                {religion.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.itemInput} variant="outlined">
                                    <InputLabel id="department-select-label">Department</InputLabel>
                                    <Select
                                        labelId="department-select-label"
                                        id="department-select"
                                        name="department"
                                        value={values.department?.id || ''}
                                        onChange={(event) => {
                                            const selectedReligion = departmentStore.departmentList.find(
                                                (department) => department.id === event.target.value
                                            );
                                            handleChange({target: {name: 'department', value: selectedReligion}});
                                        }}
                                        label="Gender"
                                        error={touched.department && Boolean(errors.department)}
                                    >
                                        {departmentStore.departmentList.map((department) => (
                                            <MenuItem key={department?.id}
                                                      value={department?.id}>{department?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FieldArray name="familyRelationships">
                                    {({push, remove}) => (
                                        <div className="family-members-container">
                                            <button
                                                type="button"
                                                className="add-family-member-btn"
                                                onClick={() => {
                                                    push({
                                                        fullName: "",
                                                        profession: "",
                                                        address: "",
                                                        description: "",
                                                    });
                                                }}
                                            >
                                                Add Family Member
                                            </button>
                                            <table className="family-members-table">
                                                <thead>
                                                <tr>
                                                    <th>Full Name</th>
                                                    <th>Profession</th>
                                                    <th>Address</th>
                                                    <th>Description</th>
                                                    <th>Action</th>
                                                    {console.log(values.familyRelationships[0])}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {values.familyRelationships && values.familyRelationships.length > 0 ? (
                                                    values.familyRelationships.map((familyMember, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <TextField
                                                                    name={`familyRelationships.${index}.fullName`}
                                                                    placeholder="Full Name"
                                                                    value={familyMember.fullName}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextField
                                                                    name={`familyRelationships.${index}.profession`}
                                                                    placeholder="Profession"
                                                                    value={familyMember.profession}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextField
                                                                    name={`familyRelationships.${index}.address`}
                                                                    placeholder="Address"
                                                                    value={familyMember.address}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextField
                                                                    name={`familyRelationships.${index}.description`}
                                                                    placeholder="Description"
                                                                    value={familyMember.description}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="remove-btn"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5">No family members added yet.</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </FieldArray>


                            < /div>
                            <div className={classes.wapperButton}>
                                <Button variant="contained" color="inherit"
                                        onClick={() => setShouldOpenEditorDialog(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="contained" color="inherit">
                                    {selected?.id ? "Update" : "Save"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
})
;
