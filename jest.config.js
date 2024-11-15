export default {
  collectCoverage: true,               // Activa la recolección de cobertura
  collectCoverageFrom: ['src/**/*.js'], // Directorios o archivos para los que recoger la cobertura
  coverageDirectory: 'coverage',       // Carpeta donde se guardará el reporte de cobertura
  coverageReporters: ['html', 'text'], // Formatos de reporte: HTML y texto
  coverageThreshold: {                 // Umbrales de cobertura que se deben alcanzar
    global: {
      statements: 80,   // Cobertura mínima de declaraciones
      branches: 80,     // Cobertura mínima de ramas
      functions: 80,    // Cobertura mínima de funciones
      lines: 80         // Cobertura mínima de líneas
    }
  }
};

  