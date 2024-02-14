import bcrypt from 'bcryptjs';

// Función para hashear una contraseña
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    return null; 
  }
};

export async function verifyPassword(password, hashedPassword){
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword); 
    return isMatch;
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    return false; // Manejo de errores
  }
};