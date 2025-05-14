import bpy

def guardar_informacion_animacion(nombre_objeto, ruta_archivo):
    # Obtener el objeto
    objeto = bpy.data.objects.get(nombre_objeto)

    if objeto is not None:
        # Abre el archivo para escritura
        with open(ruta_archivo, 'w') as archivo:
            # Iterar sobre los cuadros de la animación
            for cuadro in range(bpy.context.scene.frame_start, bpy.context.scene.frame_end + 1):
                # Establecer el cuadro actual
                bpy.context.scene.frame_set(cuadro)

                # Obtener la información de transformación del objeto
                posicion = objeto.location
                rotacion = objeto.rotation_euler
                escalado = objeto.scale

                # Escribir la información en el archivo
                archivo.write(f"Cuadro {cuadro} - Posición: {posicion}, Rotación: {rotacion}, Escalado: {escalado}\n")

        print(f"Información guardada en {ruta_archivo}")
    else:
        print(f"El objeto {nombre_objeto} no fue encontrado en la escena.")

# Cambia 'NombreDelObjeto' por el nombre de tu objeto
nombre_objeto = 'mujer'

# Cambia 'ruta/del/archivo.txt' por la ruta y nombre de archivo que desees
ruta_archivo = 'C:/Users/Gabriel/Documents/animaciones/trayectoria.txt'

# Llamada a la función para guardar la información
guardar_informacion_animacion(nombre_objeto, ruta_archivo)