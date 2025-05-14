import bpy
import os

# Establecer la ruta de la carpeta de salida
folder_name= "paraCaminaAcuesta"
output_folder = f"C:/Users/Gabriel/Documents/animaciones/{folder_name}"

# Obtener el objeto que contiene la animación
obj = bpy.context.active_object

vsc_folder = "animation/"
obj_name = "mujerCamina"
    
# Crear un archivo de texto para escribir los nombres de los archivos .obj
log_file_path = os.path.join(output_folder, "log.txt")
with open(log_file_path, "w") as log_file:
    log_file.write(f"************ {obj_name} ************\n [")

# Iterar sobre los cuadros de la animación
for frame in range(bpy.context.scene.frame_start, bpy.context.scene.frame_end + 1):
    # Establecer el cuadro actual
    bpy.context.scene.frame_set(frame)

    # Construir la ruta del archivo .obj para el cuadro actual

    frame_str = str(frame).zfill(4)  # Asegurar que el número de cuadro tenga al menos 4 dígitos
    file_path = os.path.join(output_folder, f"{obj_name}_{frame_str}.obj")

    # Exportar el cuadro actual como archivo .obj
    bpy.ops.export_scene.obj(filepath=file_path, use_selection=True, use_animation=False)

    # Escribir el nombre del archivo en el archivo de texto
    
    if frame==bpy.context.scene.frame_end :
        with open(log_file_path, "a") as log_file:
            log_file.write(f"'{vsc_folder}{os.path.basename(file_path)}']\n")
    else :    
        with open(log_file_path, "a") as log_file:
            log_file.write(f"'{vsc_folder}{os.path.basename(file_path)}',\n")
        
print("Exportación completada. Nombres de archivos guardados en log.txt.")