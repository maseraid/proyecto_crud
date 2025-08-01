import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    getEmpleados();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setCargo("");
    setAnios(0);
    setEdad(0);
    setPais("");
    setModoEdicion(false);
    setIdEditar(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !cargo || anios < 0 || edad < 0 || !pais) {
      Swal.fire("Faltan datos", "Por favor, completa todos los campos correctamente.", "warning");
      return;
    }

    if (modoEdicion) {
      actualizarEmpleado(idEditar);
    } else {
      agregarEmpleado();
    }
  };

  const agregarEmpleado = () => {
    axios
      .post("http://localhost:3000/api/empleados", {
        nombres: nombre,
        ocupacion: cargo,
        anios,
        edad,
        pais,
      })
      .then(() => {
        Swal.fire("¡Registro exitoso!", "Empleado agregado correctamente.", "success");
        limpiarFormulario();
        getEmpleados();
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo registrar el empleado.", "error");
      });
  };

  const actualizarEmpleado = (id) => {
    axios
      .put(`http://localhost:3000/api/empleados/${id}`, {
        nombres: nombre,
        ocupacion: cargo,
        anios,
        edad,
        pais,
      })
      .then(() => {
        Swal.fire("¡Actualización exitosa!", "Datos del empleado actualizados.", "success");
        limpiarFormulario();
        getEmpleados();
      })
      .catch(() => {
        Swal.fire("Error", "No se pudo actualizar el empleado.", "error");
      });
  };

  const getEmpleados = () => {
    axios
      .get("http://localhost:3000/api/empleados")
      .then((res) => setEmpleados(res.data))
      .catch((err) => console.error("Error al obtener empleados", err));
  };

  const eliminarEmpleado = (id) => {
    Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/empleados/${id}`)
          .then(() => {
            Swal.fire("¡Eliminado!", "El empleado ha sido eliminado.", "success");
            getEmpleados();
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar el empleado.", "error");
          });
      }
    });
  };

  const cargarEmpleadoParaEditar = (emp) => {
    setNombre(emp.nombres);
    setCargo(emp.ocupacion);
    setAnios(emp.anios);
    setEdad(emp.edad);
    setPais(emp.pais);
    setIdEditar(emp.id);
    setModoEdicion(true);
  };

  return (
     <div class="app-container">
        <div class="form-section">
            <form class="employee-form" onSubmit={handleSubmit}>
                <h2 class="form-title">{modoEdicion ? "Editar Empleado" : "Agregar Empleado"}</h2>

                <div class="form-group">
                    <label class="form-label">Nombre Completo</label>
                    <input type="text" class="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>

                <div class="form-group">
                    <label class="form-label">Ocupación</label>
                    <input type="text" class="form-control" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
                </div>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label class="form-label">Años de Trabajo</label>
                        <input type="number" class="form-control" value={anios} onChange={(e) => setAnios(Number(e.target.value))} min="0" required />
                    </div>

                    <div class="form-group col-md-6">
                        <label class="form-label">Edad</label>
                        <input type="number" class="form-control" value={edad} onChange={(e) => setEdad(Number(e.target.value))} min="0" required />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">País</label>
                    <input type="text" class="form-control" value={pais} onChange={(e) => setPais(e.target.value)} required />
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary" type="submit">
                        {modoEdicion ? "Actualizar" : "Enviar"}
                    </button>
                    {modoEdicion && (
                        <button class="btn btn-secondary" type="button" onClick={limpiarFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>

        <div class="table-section">
            <h2 class="table-title">Registro de Empleados</h2>
            <div class="table-responsive">
                <table class="employee-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Ocupación</th>
                            <th>Años</th>
                            <th>Edad</th>
                            <th>País</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.length > 0 ? (
                            empleados.map((emp, index) => (
                                <tr key={emp._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{emp.id}</td>
                                    <td>{emp.nombres}</td>
                                    <td>{emp.ocupacion}</td>
                                    <td>{emp.anios}</td>
                                    <td>{emp.edad}</td>
                                    <td>{emp.pais}</td>
                                    <td class="actions-cell">
                                        <button class="btn btn-edit" onClick={() => cargarEmpleadoParaEditar(emp)}>
                                            Editar
                                        </button>
                                        <button class="btn btn-delete" onClick={() => eliminarEmpleado(emp.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colspan="8" class="no-data">
                                    No hay empleados registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default App;