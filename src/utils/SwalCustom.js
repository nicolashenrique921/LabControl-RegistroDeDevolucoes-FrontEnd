import Swal from 'sweetalert2';

// Criamos uma instância personalizada do SweetAlert2
const MySwal = Swal.mixin({
  customClass: {
    confirmButton: 'swal-button-confirm',
    cancelButton: 'swal-button-cancel'
  },
  buttonsStyling: false, // Desativamos o estilo padrão para usar o nosso CSS
  background: '#ffffff',
  color: '#333',
  confirmButtonColor: '#27ae60',
  cancelButtonColor: '#e74c3c',
});

export const toast = (title, icon = 'success') => {
  MySwal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export default MySwal;