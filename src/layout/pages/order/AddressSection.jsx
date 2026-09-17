import React, { useState } from 'react';
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
} from '@coreui/react';
import { MapPin, Plus, Pencil, Home, Building2, X } from 'lucide-react';

const emptyForm = {
  fullName: '',
  phone: '',
  pincode: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  type: 'Home',
  isDefault: false,
};

/**
 * AddressSection
 * Displays saved addresses as selectable cards and lets the user add or
 * edit an address inline.
 *
 * @param {Object[]} addresses        - list of saved addresses
 * @param {string|number} selectedId  - id of the currently selected address
 * @param {(id) => void} onSelect     - called when a saved card is chosen
 * @param {(addr) => void} onSave     - called with the full address object on add/edit save
 */
const AddressSection = ({ addresses = [], selectedId, onSelect, onSave }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setForm({ ...addr });
    setEditingId(addr.id);
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setErrors({});
  };

  const handleChange = (field) => (e) => {
    const value = field === 'isDefault' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Name is required';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit number';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode';
    if (!form.line1.trim()) next.line1 = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.state.trim()) next.state = 'State is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, id: editingId ?? `addr-${Date.now()}` });
    setShowForm(false);
  };

  return (
    <CCard className="sabr-card sabr-card--current">
      <CCardHeader className="sabr-card__header">
        <div className="sabr-card__eyebrow">STEP 01</div>
        <h6 className="sabr-card__title">
          <MapPin size={18} className="me-2 mb-1" />
          Delivery Address
        </h6>
      </CCardHeader>

      <CCardBody className="sabr-card__body">
        {addresses.length > 0 && (
          <div className="sabr-addr-grid mb-3">
            {addresses.map((addr) => {
              const selected = addr.id === selectedId;
              return (
                <div
                  key={addr.id}
                  className={`sabr-addr-card ${selected ? 'sabr-addr-card--selected' : ''}`}
                  role="radio"
                  aria-checked={selected}
                  tabIndex={0}
                  onClick={() => onSelect(addr.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(addr.id)}
                >
                  <button
                    type="button"
                    className="sabr-addr-card__edit"
                    aria-label={`Edit address for ${addr.fullName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(addr);
                    }}
                  >
                    <Pencil size={15} />
                  </button>

                  <div className="sabr-addr-card__top">
                    <div className="sabr-addr-card__radio">
                      {selected && <div className="sabr-addr-card__radio-dot" />}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-2">
                    {addr.type === 'Office' ? <Building2 size={14} /> : <Home size={14} />}
                    <span className="sabr-addr-card__name">{addr.fullName}</span>
                    {addr.isDefault && <span className="sabr-addr-card__tag">Default</span>}
                  </div>

                  <div className="sabr-addr-card__text">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ''}
                    <br />
                    {addr.city}, {addr.state} – {addr.pincode}
                    <br />
                    Phone: {addr.phone}
                  </div>
                </div>
              );
            })}

            {!showForm && (
              <button type="button" className="sabr-addr-add" onClick={openAddForm}>
                <Plus size={18} />
                Add New Address
              </button>
            )}
          </div>
        )}

        {addresses.length === 0 && !showForm && (
          <button type="button" className="sabr-addr-add w-100 mb-3" onClick={openAddForm}>
            <Plus size={18} />
            Add a Delivery Address
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="sabr-card__eyebrow mb-0">
                {editingId ? 'EDIT ADDRESS' : 'NEW ADDRESS'}
              </span>
              <button
                type="button"
                className="btn btn-sm p-0 border-0 bg-transparent"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={18} color="var(--sabr-ink-soft)" />
              </button>
            </div>

            <CRow className="g-3">
              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">Full Name</CFormLabel>
                <CFormInput
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  invalid={!!errors.fullName}
                  feedback={errors.fullName}
                  placeholder="e.g. Ananya Sharma"
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">Phone Number</CFormLabel>
                <CFormInput
                  value={form.phone}
                  onChange={handleChange('phone')}
                  invalid={!!errors.phone}
                  feedback={errors.phone}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">Address Line 1</CFormLabel>
                <CFormInput
                  value={form.line1}
                  onChange={handleChange('line1')}
                  invalid={!!errors.line1}
                  feedback={errors.line1}
                  placeholder="House no., street, area"
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">Address Line 2 (optional)</CFormLabel>
                <CFormInput
                  value={form.line2}
                  onChange={handleChange('line2')}
                  placeholder="Landmark, apartment"
                />
              </CCol>

              <CCol xs={12} md={4}>
                <CFormLabel className="sabr-form-label">City</CFormLabel>
                <CFormInput
                  value={form.city}
                  onChange={handleChange('city')}
                  invalid={!!errors.city}
                  feedback={errors.city}
                />
              </CCol>
              <CCol xs={12} md={4}>
                <CFormLabel className="sabr-form-label">State</CFormLabel>
                <CFormInput
                  value={form.state}
                  onChange={handleChange('state')}
                  invalid={!!errors.state}
                  feedback={errors.state}
                />
              </CCol>
              <CCol xs={12} md={4}>
                <CFormLabel className="sabr-form-label">Pincode</CFormLabel>
                <CFormInput
                  value={form.pincode}
                  onChange={handleChange('pincode')}
                  invalid={!!errors.pincode}
                  feedback={errors.pincode}
                  maxLength={6}
                />
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="sabr-form-label">Address Type</CFormLabel>
                <CFormSelect value={form.type} onChange={handleChange('type')}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6} className="d-flex align-items-end">
                <CFormCheck
                  id="sabr-default-addr"
                  label="Set as default address"
                  checked={form.isDefault}
                  onChange={handleChange('isDefault')}
                />
              </CCol>
            </CRow>

            <div className="d-flex gap-2 mt-4">
              <CButton type="submit" className="sabr-btn-primary">
                Save Address
              </CButton>
              <CButton type="button" className="sabr-btn-outline" onClick={closeForm}>
                Cancel
              </CButton>
            </div>
          </form>
        )}
      </CCardBody>
    </CCard>
  );
};

export default AddressSection;
