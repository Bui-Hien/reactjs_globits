import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CountryForm from "./CountryForm";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {observer} from "mobx-react";
import {useStore} from "../../stores";
import PaginationCustom from "../../common/PaginationCustom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2),
    }, table: {
        minWidth: 650,
    }, button: {}, pagination: {
        "& > *": {
            marginTop: theme.spacing(2),
        }, display: "flex", justifyContent: "end",
    }, delete: {
        border: "1px solid",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
    }, popper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1300,
    }, search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        border: "1px solid gray",
        width: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "between",
    }, searchIcon: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: theme.spacing(0, 1),
        backgroundColor: "#01c0c8",
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    }, inputInput: {
        paddingLeft: "10px",
    }, nav: {
        display: "flex", justifyContent: "space-between", marginBottom: theme.spacing(2),
    },
}));

export default observer(function CountryIndex() {
    const {countryStore} = useStore(); // Đổi từ campaignStore sang agentStore
    const {
        countryList, search, updatePageData,
    } = countryStore;
    useEffect(() => {
        search();
    }, []);

    const classes = useStyles();

    const handleIconClick = () => {
        updatePageData(countryStore.keyword);
    };
    const handleKeyDown = (e) => {
        countryStore.setKeyword(e.target.value);
        if (e.key === "Enter") {
            updatePageData(countryStore.keyword);
        }
    };
    return (<div className={classes.root}>
            <div className={classes.nav}>
                <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={classes.button}
                    onClick={() => {
                        countryStore.setShouldOpenEditorDialog(true)
                        countryStore.setSelectedCountry(null)

                    }}
                >
                    Thêm mới <AddCircleOutlineOutlinedIcon/>
                </Button>
                <div className={classes.search}>
                    <InputBase
                        placeholder="search…"
                        classes={{
                            root: classes.inputRoot, input: classes.inputInput,
                        }}
                        onChange={(e) => handleKeyDown(e)}
                        onKeyPress={handleKeyDown}
                        inputProps={{"aria-label": "search"}}
                    />
                    <div className={classes.searchIcon} onClick={handleIconClick}>
                        <SearchIcon/>
                    </div>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countryList?.map((row, index) => (<TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                                <EditOutlinedIcon
                                    onClick={() => {
                                        countryStore.setShouldOpenEditorDialog(true)
                                        countryStore.setSelectedCountry(row)
                                    }}
                                />
                                <DeleteForeverOutlinedIcon
                                    onClick={(event) => {
                                        countryStore.setSelectedCountry(row);
                                        countryStore.setShouldOpenConfirmationDialog(true)
                                    }}
                                />
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.pagination}>
                <PaginationCustom
                    rowsPerPage={countryStore.rowsPerPage}
                    setRowsPerPage={countryStore.setRowsPerPage}
                    totalPages={countryStore.totalPages}
                    page={countryStore.page}
                    handleChangePage={countryStore.handleChangePage}
                />
            </div>
            <CountryForm
                data={countryStore.selectedCountry}
                isOpen={countryStore.shouldOpenEditorDialog}
                setClose={countryStore.setShouldOpenEditorDialog}
                updateCountry={countryStore.updateCountry}
                createCountry={countryStore.saveCountry}
            />
            {countryStore.shouldOpenConfirmationDialog && (<Dialog
                open={countryStore.shouldOpenConfirmationDialog}
                onClose={() => countryStore.setShouldOpenConfirmationDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Bạn có muốn xóa không?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => countryStore.setShouldOpenConfirmationDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => countryStore.handleConfirmDelete()} color="primary" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>)}
        </div>

    );
});