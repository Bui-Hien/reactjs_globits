import {makeAutoObservable, runInAction} from "mobx";
import {pagingCountries, getCountry, createCountry, editCountry, deleteCountry} from "./CountryService";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

export default class CountryStore {
    countryList = [];
    selectedCountry = null;
    totalElements = 0;
    totalPages = 0;
    page = 1;
    rowsPerPage = 10;
    keyword = "";
    loadingInitial = false;
    shouldOpenEditorDialog = false;
    shouldOpenConfirmationDialog = false;

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingInitial = (state) => {
        this.loadingInitial = state;
    };

    setKeyword = (value) => {
        this.keyword = value;  // Cập nhật 'keyword' trong store
    }

    search = async () => {
        this.loadingInitial = true;

        const searchObject = {
            keyword: this.keyword,
            pageIndex: this.page,
            pageSize: this.rowsPerPage,
        };

        try {
            let res = await pagingCountries(searchObject);

            runInAction(() => {
                this.countryList = res?.data?.content || [];
                this.totalElements = res?.data?.totalElements;
                this.totalPages = res?.data?.totalPages;
                this.loadingInitial = false;
            });
        } catch (error) {
            toast.warning("Failed to load countries.");
            this.loadingInitial = false;
        }
    };

    setShouldOpenConfirmationDialog = (state) => {
        this.shouldOpenConfirmationDialog = state;
    }

    setShouldOpenEditorDialog = (state) => {
        console.log(this)
        this.shouldOpenEditorDialog = state;
    }


    handleClose() {
        this.shouldOpenEditorDialog = false;
    }

    updatePageData = (keyword) => {
        if (keyword !== "" && keyword !== undefined && keyword !== null) {
            this.page = 1;
            this.keyword = keyword;
        }
        this.search();
    };

    setSelectedCountry = (country) => {
        this.selectedCountry = country;
    };

    setPage = (page) => {
        this.page = page;
        this.updatePageData();
    };

    setRowsPerPage = (event) => {
        this.rowsPerPage = Number(event.target.value) || 10;
        this.page = 1;
        this.updatePageData();
    };
    setPageSize = (values) => {
        this.rowsPerPage = Number(values);
        this.page = 1;
        this.updatePageData();
    }
    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleClose = (state) => {
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
        if (state) this.search();
    };

    handleConfirmDelete = async () => {
        try {
            const res = await deleteCountry(this.selectedCountry.id);
            if (res?.data) {
                this.handleClose(true);
                toast.success("Deleted successfully.");
            } else {
                console.error(res?.data);
                toast.warning("Deleted failure.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    getCountry = async (id) => {
        if (id != null) {
            try {
                const data = await getCountry(id);
                this.handleSelectCountry(data?.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            this.handleSelectCountry(null);
        }
    };

    handleSelectCountry = (country) => {
        this.selectedCountry = country;
    };

    updateCountry = async (country) => {
        try {
            console.log(this)
            const res = await editCountry(country);
            this.handleClose(true);
            toast.success("Updated successfully!")
            return res?.data;
        } catch (error) {
            console.log(error);
            toast.warning("An error occurred while saving.");
        }
    };

    saveCountry = async (country) => {
        try {
            const res = await createCountry(country);
            this.handleClose(true);
            toast.success("Created successfully!"
            );
            return res?.data;
        } catch (error) {
            console.log(error);
            toast.warning("An error occurred while saving.");
        }
    };

    resetCountryStore = () => {
        this.countryList = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.selectedCountry = null;
        this.page = 1;
        this.rowsPerPage = 10;
        this.keyword = "";
        this.loadingInitial = false;
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
    };
}