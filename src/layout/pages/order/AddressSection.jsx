import React, { useEffect, useState } from "react";

import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CFormLabel,
  CButton,
} from "@coreui/react";

import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Home,
  Building2,
  X,
} from "lucide-react";

import {
  getAddressesApi,
  createAddressApi,
  updateAddressApi,
  setDefaultAddressApi,
  deleteAddressApi,
} from "../../../services/address.api";
import { useConfirm } from "../../components/confirm/ConfirmModal";
import { useLocations } from "../../../context/LocationContext";
import CustomDropdown from "../../components/dropdown/CustomDropdown";

const emptyForm = {
  name: "",
  phoneNo: "",
  pincode: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  addressType: "Home",
  country: "India",
  isDefault: false,
};

const AddressSection = ({
  addresses = [],
  selectedId,
  onSelect,
  onSave,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { confirm, modal } = useConfirm();
  const { locations, locationLoading } = useLocations();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const stateOptions = Object.values(locations || {}).map((state) => ({
    label: state.name,
    value: state.slug,
  }));

  const getStateName = (slug) => {
  return Object.values(locations || {}).find(
      (state) => state.slug === slug
    )?.name || "";
  };

  const districtOptions =
  locations?.[form.state]?.districts?.districts?.map((district) => ({
    label: district.name,
    value: district.name,
  })) || [];

  const handleDropdownChange = (field) => (value) => {
    console.log(field, value);
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  // ==========================================
  // LOAD ADDRESSES
  // ==========================================

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAddressesApi();

      const data = response?.data || [];
      onSave?.({
        __type: "LOAD_ADDRESSES",
        addresses: data,
      });

      // Automatically select default address
      const defaultAddress = data.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        onSelect?.(defaultAddress.id);
      } else if (data.length > 0 && !selectedId) {
        onSelect?.(data[0].id);
      }
    } catch (error) {
      console.error("Load addresses error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAddresses();
  }, []);

  // ==========================================
  // ADD FORM
  // ==========================================

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  // ==========================================
  // EDIT FORM
  // ==========================================

  const openEditForm = (address) => {
    setForm({
      name: address.name || "",
      phoneNo: address.phoneNo || "",
      pincode: String(address.pincode || ""),
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      addressType: address.addressType || "Home",
      country: address.country || "India",
      isDefault: address.isDefault || false,
    });

    setEditingId(address.id);
    setErrors({});
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
    setForm(emptyForm);
    window.scrollTo(0,0);
  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (field) => (e) => {
    const value =
      field === "isDefault"
        ? e.target.checked
        : e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // VALIDATE
  // ==========================================

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Name is required";
    }

    if (!/^\d{10}$/.test(form.phoneNo.trim())) {
      next.phoneNo = "Enter a valid 10-digit number";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = "Enter a valid 6-digit pincode";
    }

    if (!form.addressLine1.trim()) {
      next.addressLine1 = "Address is required";
    }

    if (!form.city.trim()) {
      next.city = "City is required";
    }

    if (!form.state.trim()) {
      next.state = "State is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setErrors({});

      const payload = {
        name: form.name.trim(),
        phoneNo: form.phoneNo.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2:
          form.addressLine2.trim() || null,
        addressType: form.addressType,
        city: form.city.trim(),
        pincode: Number(form.pincode),
        state: getStateName(form.state),
        country: form.country || "India",
        isDefault: form.isDefault,
      };

      let response;

      if (editingId) {
        response = await updateAddressApi(
          editingId,
          payload
        );
      } else {
        response = await createAddressApi(payload);
      }

      const savedAddress = response?.data;

      if (!savedAddress) {
        throw new Error(
          "Invalid address response"
        );
      }

      onSave?.(savedAddress);

      onSelect?.(savedAddress.id);

      closeForm();

      // Reload because setting default can
      // change other addresses
      await loadAddresses();
    } catch (error) {
      console.error("Save address error:", error);

      setErrors({
        submit:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save address",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // SET DEFAULT
  // ==========================================

  const handleSetDefault = async (id) => {
    try {
      setLoading(true);

      const response =
        await setDefaultAddressApi(id);

      const updatedAddress = response?.data;

      if (updatedAddress) {
        onSelect?.(id);
        onSave?.(updatedAddress);
      }

      await loadAddresses();
    } catch (error) {
      console.error(
        "Set default address error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleteHelper = async (id) => {
  try {
    await deleteAddressApi(id);
    await loadAddresses();
    if (selectedId === id) onSelect?.(null);
  } catch (error) {
    console.error('Delete address error:', error);
    throw error; 
  }
};
  const handleDelete = async (address) => {
    const ok = await confirm({
      variant: 'danger',
      title: 'Delete this address?',
      message: 'This action cannot be undone.',
      // details: address.name,          
      confirmText: 'Yes, delete',
      onConfirm: () => handleDeleteHelper(address),
    });
  };

  return (
    <>
    <CCard className="sabr-card sabr-card--current">

      <CCardHeader className="sabr-card__header">

        <div className="sabr-card__eyebrow">
          STEP 01
        </div>

        <h6 className="sabr-card__title">
          <MapPin
            size={18}
            className="me-2 mb-1"
          />
          Delivery Address
        </h6>

      </CCardHeader>

      <CCardBody className="sabr-card__body">

        {loading && (
          <div className="text-muted small mb-3">
            Loading...
          </div>
        )}

        {/* ADDRESS LIST */}

        {addresses.length > 0 && (
          <div className="sabr-addr-grid mb-3">

            {addresses.map((address) => {

              const selected =
                address.id === selectedId;

              return (
                <div
                  key={address.id}
                  className={`sabr-addr-card ${
                    selected
                      ? "sabr-addr-card--selected"
                      : ""
                  }`}
                  role="radio"
                  aria-checked={selected}
                  tabIndex={0}
                  onClick={() =>
                    onSelect?.(address.id)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === " "
                    ) {
                      onSelect?.(address.id);
                    }
                  }}
                >

                  {/* EDIT + DELETE */}

                  <div className="d-flex gap-2 position-absolute top-0 end-0 p-2">

                    <button
                      type="button"
                      className="sabr-addr-card__edit mx-4"
                      aria-label={`Edit address for ${address.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(address);
                      }}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="sabr-addr-card__edit"
                      aria-label={`Delete address for ${address.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address.id);
                      }}
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                  {/* RADIO */}

                  <div className="sabr-addr-card__top">
                    <div className="sabr-addr-card__radio">
                      {selected && (
                        <div className="sabr-addr-card__radio-dot" />
                      )}
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="d-flex align-items-center gap-2 mt-2">

                    {address.addressType ===
                    "Office" ? (
                      <Building2 size={14} />
                    ) : (
                      <Home size={14} />
                    )}

                    <span className="sabr-addr-card__name">
                      {address.name}
                    </span>

                    {address.isDefault && (
                      <span className="sabr-addr-card__tag">
                        Default
                      </span>
                    )}

                  </div>

                  {/* ADDRESS */}

                  <div className="sabr-addr-card__text">

                    {address.addressLine1}

                    {address.addressLine2
                      ? `, ${address.addressLine2}`
                      : ""}

                    <br />

                    {address.city},{" "}
                    {address.state} –{" "}
                    {address.pincode}

                    <br />

                    Phone: {address.phoneNo}

                  </div>

                  {/* SET DEFAULT */}

                  {/* {!address.isDefault && (
                    <CButton
                      size="sm"
                      color="light"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(
                          address.id
                        );
                      }}
                    >
                      Set Default
                    </CButton>
                  )} */}

                </div>
              );
            })}

            {!showForm && (
              <button
                type="button"
                className="sabr-addr-add"
                onClick={openAddForm}
              >
                <Plus size={18} />
                Add New Address
              </button>
            )}

          </div>
        )}

        {/* NO ADDRESS */}

        {addresses.length === 0 &&
          !showForm && (
            <button
              type="button"
              className="sabr-addr-add w-100 mb-3"
              onClick={openAddForm}
            >
              <Plus size={18} />
              Add a Delivery Address
            </button>
          )}

        {/* FORM */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="d-flex justify-content-between align-items-center mb-3">

              <span className="sabr-card__eyebrow mb-0">
                {editingId
                  ? "EDIT ADDRESS"
                  : "NEW ADDRESS"}
              </span>

              <button
                type="button"
                className="btn btn-sm p-0 border-0 bg-transparent"
                onClick={closeForm}
              >
                <X
                  size={18}
                  color="var(--sabr-ink-soft)"
                />
              </button>

            </div>

            {errors.submit && (
              <div className="text-danger small mb-3">
                {errors.submit}
              </div>
            )}

            <CRow className="g-3">

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Full Name
                </CFormLabel>

                <CFormInput
                  value={form.name}
                  onChange={handleChange("name")}
                  invalid={!!errors.name}
                  feedback={errors.name}
                  placeholder="e.g. Ananya Sharma"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Phone Number
                </CFormLabel>

                <CFormInput
                  value={form.phoneNo}
                  onChange={handleChange("phoneNo")}
                  invalid={!!errors.phoneNo}
                  feedback={errors.phoneNo}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Address Line 1
                </CFormLabel>

                <CFormInput
                  value={form.addressLine1}
                  onChange={handleChange("addressLine1")}
                  invalid={!!errors.addressLine1}
                  feedback={errors.addressLine1}
                  placeholder="House no., street, area"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Address Line 2
                </CFormLabel>

                <CFormInput
                  value={form.addressLine2}
                  onChange={handleChange("addressLine2")}
                  placeholder="Landmark, apartment"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  State
                </CFormLabel>

                {/* <CFormInput
                  value={form.state}
                  onChange={handleChange("state")}
                  invalid={!!errors.state}
                  feedback={errors.state}
                /> */}
                <CustomDropdown
                  options={stateOptions}
                  value={form.state}
                  onChange={handleDropdownChange("state")}
                  placeholder={locationLoading ? "Loading states..." : "Select State"}
                  disabled={locationLoading}
                />

                {errors.state && (
                  <div className="invalid-feedback d-block">
                    {errors.state}
                  </div>
                )}
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  City
                </CFormLabel>

                {/* <CFormInput
                  value={form.city}
                  onChange={handleChange("city")}
                  invalid={!!errors.city}
                  feedback={errors.city}
                /> */}
                <CustomDropdown
                  options={districtOptions}
                  value={form.city}
                  placeholder={locationLoading ? "Loading district..." : "Select District"}
                  onChange={handleDropdownChange("city")}
                  disabled={!form.state}
                />  
                {errors.state && (
                  <div className="invalid-feedback d-block">
                    {errors.city}
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Pincode
                </CFormLabel>

                <CFormInput
                  value={form.pincode}
                  onChange={handleChange("pincode")}
                  invalid={!!errors.pincode}
                  feedback={errors.pincode}
                  maxLength={6}
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">
                  Address Type
                </CFormLabel>

                <CFormSelect
                  value={form.addressType}
                  onChange={handleChange(
                    "addressType"
                  )}
                >
                  <option value="Home">
                    Home
                  </option>

                  <option value="Office">
                    Office
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </CFormSelect>
              </CCol>

              <CCol
                xs={12}
                md={6}
                className="d-flex align-items-end"
              >
                <CFormCheck
                  id="sabr-default-addr"
                  label="Set as default address"
                  checked={form.isDefault}
                  onChange={handleChange(
                    "isDefault"
                  )}
                />
              </CCol>

            </CRow>

            <div className="d-flex gap-2 mt-4">

              <CButton
                type="submit"
                className="sabr-btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Address"}
              </CButton>

              <CButton
                type="button"
                className="sabr-btn-outline"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </CButton>

            </div>

          </form>
        )}

      </CCardBody>
    </CCard>
    {modal}
    </>
  );
};

export default AddressSection;