function showInput() {
    const attribute = document.getElementById('attribute').value;
    const inputField = document.getElementById('input-field');
    const input = document.getElementById('value');
    const submitBtn = document.getElementById('submit-btn');

    if (attribute) {
        inputField.style.display = 'block';
        submitBtn.disabled = false;
        input.placeholder = `Enter new ${attribute.replace('_', ' ')}`;

        // Set input type based on attribute
        if (attribute === 'email') {
            input.type = 'email';
        } else if (attribute === 'date_of_birth') {
            input.type = 'date';
        } else if (attribute === 'mobile_number' || attribute === 'id_number') {
            input.type = 'text';
            input.pattern = attribute === 'mobile_number' ? '\\d{11}' : '\\d{13}';
            input.title = attribute === 'mobile_number' ? 'Must be 11 digits' : 'Must be 13 digits';
        } else if (attribute === 'gender') {
            input.type = 'text';
            input.placeholder = 'Enter Male, Female, or Other';
        } else if (attribute === 'role') {
            input.type = 'text';
            input.placeholder = 'Enter Patient, Doctor, Admin, or Receptionist';
        } else {
            input.type = 'text';
            input.removeAttribute('pattern');
            input.removeAttribute('title');
        }
    } else {
        inputField.style.display = 'none';
        submitBtn.disabled = true;
    }
}