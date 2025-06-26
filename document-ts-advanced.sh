#!/bin/bash

# ====================================================================
# 📚 DOCUMENTADOR AVANZADO DE TYPESCRIPT
# ====================================================================
# Autor: Auto-generado
# Descripción: Script que documenta automáticamente archivos TypeScript
# detectando APIs, servicios, hooks, componentes y mucho más
# ====================================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables globales
TOTAL_FILES=0
PROCESSED_FILES=0
SRC_DIR="${1:-./src}"
TIMESTAMP=$(date '+%d/%m/%Y %H:%M:%S')
LOG_FILE="documentation_$(date +%Y%m%d_%H%M%S).log"

# ====================================================================
# FUNCIONES UTILITARIAS
# ====================================================================

print_header() {
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${CYAN}📚 DOCUMENTADOR AVANZADO DE TYPESCRIPT${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${YELLOW}📁 Directorio objetivo: ${SRC_DIR}${NC}"
    echo -e "${YELLOW}📅 Fecha de ejecución: ${TIMESTAMP}${NC}"
    echo -e "${YELLOW}📄 Log guardado en: ${LOG_FILE}${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
}

log_message() {
    local message="$1"
    local level="${2:-INFO}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_FILE"
    
    case $level in
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO") echo -e "${CYAN}📄 $message${NC}" ;;
        *) echo -e "$message" ;;
    esac
}

# ====================================================================
# FUNCIONES DE ANÁLISIS DE CÓDIGO
# ====================================================================

extract_imports() {
    local file="$1"
    grep -E "^import\s+.*from\s+['\"].*['\"]" "$file" | sed 's/^import //' | sort -u
}

extract_exports() {
    local file="$1"
    {
        grep -E "^export\s+(const|let|var|function|class|interface|type|enum|default)" "$file"
        grep -E "^export\s*\{.*\}" "$file"
        grep -E "^export\s+default" "$file"
    } | sort -u
}

extract_functions() {
    local file="$1"
    {
        # Funciones tradicionales
        grep -E "(export\s+)?(async\s+)?function\s+\w+" "$file" | sed -E 's/.*function\s+([a-zA-Z_][a-zA-Z0-9_]*).*/\1/'
        
        # Arrow functions
        grep -E "(export\s+)?const\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>" "$file" | sed -E 's/.*const\s+([a-zA-Z_][a-zA-Z0-9_]*).*/\1/'
        
        # Métodos de clase
        grep -E "\s+\w+\s*\([^)]*\)\s*:\s*.+\s*\{" "$file" | sed -E 's/.*\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(.*/\1/'
    } | grep -v "^$" | sort -u
}

extract_classes() {
    local file="$1"
    grep -E "(export\s+)?(abstract\s+)?class\s+\w+" "$file" | sed -E 's/.*(class\s+)([a-zA-Z_][a-zA-Z0-9_]*).*/\2/' | sort -u
}

extract_interfaces() {
    local file="$1"
    grep -E "(export\s+)?interface\s+\w+" "$file" | sed -E 's/.*(interface\s+)([a-zA-Z_][a-zA-Z0-9_]*).*/\2/' | sort -u
}

extract_types() {
    local file="$1"
    grep -E "(export\s+)?type\s+\w+" "$file" | sed -E 's/.*(type\s+)([a-zA-Z_][a-zA-Z0-9_]*).*/\2/' | sort -u
}

extract_enums() {
    local file="$1"
    grep -E "(export\s+)?enum\s+\w+" "$file" | sed -E 's/.*(enum\s+)([a-zA-Z_][a-zA-Z0-9_]*).*/\2/' | sort -u
}

extract_constants() {
    local file="$1"
    grep -E "(export\s+)?const\s+[A-Z_][A-Z0-9_]*\s*=" "$file" | sed -E 's/.*(const\s+)([A-Z_][A-Z0-9_]*).*/\2/' | sort -u
}

# ====================================================================
# FUNCIONES DE ANÁLISIS ESPECÍFICO
# ====================================================================

extract_api_endpoints() {
    local file="$1"
    {
        # Express routes
        grep -E "\.(get|post|put|delete|patch)\s*\(" "$file" | sed -E "s/.*\.(get|post|put|delete|patch)\s*\(\s*['\"]([^'\"]*)['\"].*/\1: \2/"
        
        # Fetch calls
        grep -E "fetch\s*\(" "$file" | sed -E "s/.*fetch\s*\(\s*['\"\`]([^'\"]*)['\"\`].*/GET: \1/"
        
        # Axios calls
        grep -E "axios\.(get|post|put|delete|patch)" "$file" | sed -E "s/.*axios\.(get|post|put|delete|patch)\s*\(\s*['\"\`]([^'\"]*)['\"\`].*/\1: \2/"
        
        # HTTP methods in strings
        grep -E "['\"]https?://[^'\"]*['\"]" "$file" | sed -E "s/.*['\"]https?:\/\/([^'\"]*)['\"].*/URL: \1/"
    } | grep -v "^$" | sort -u
}

extract_react_hooks() {
    local file="$1"
    {
        # React hooks usage
        grep -E "use[A-Z][a-zA-Z]*\s*\(" "$file" | sed -E 's/.*use([A-Z][a-zA-Z]*)\s*\(.*/use\1/'
        
        # Custom hooks definitions
        grep -E "(export\s+)?(const|function)\s+use[A-Z][a-zA-Z]*" "$file" | sed -E 's/.*(const|function)\s+(use[A-Z][a-zA-Z]*).*/\2/'
    } | grep -v "^$" | sort -u
}

extract_react_components() {
    local file="$1"
    {
        # Functional components
        grep -E "(export\s+)?(const|function)\s+[A-Z][a-zA-Z]*.*=>" "$file" | sed -E 's/.*(const|function)\s+([A-Z][a-zA-Z]*).*/\2/'
        
        # Class components
        grep -E "class\s+[A-Z][a-zA-Z]*.*extends.*Component" "$file" | sed -E 's/.*class\s+([A-Z][a-zA-Z]*).*/\1/'
        
        # JSX elements
        grep -E "<[A-Z][a-zA-Z]*" "$file" | sed -E 's/.*<([A-Z][a-zA-Z]*).*/\1/' | head -10
    } | grep -v "^$" | sort -u
}

extract_database_models() {
    local file="$1"
    {
        # Mongoose models
        grep -E "mongoose\.model|Schema\s*=" "$file" | sed -E "s/.*model\s*\(\s*['\"]([^'\"]*)['\"].*/Model: \1/"
        
        # Sequelize models
        grep -E "sequelize\.define|Model\.init" "$file" | sed -E "s/.*define\s*\(\s*['\"]([^'\"]*)['\"].*/Sequelize: \1/"
        
        # Prisma models
        grep -E "@prisma\/client" "$file" && echo "Prisma Client detected"
        
        # TypeORM entities
        grep -E "@Entity\s*\(" "$file" | sed -E "s/.*@Entity\s*\(\s*['\"]([^'\"]*)['\"].*/Entity: \1/"
    } | grep -v "^$" | sort -u
}

extract_middlewares() {
    local file="$1"
    {
        # Express middlewares
        grep -E "(req\s*,\s*res\s*,\s*next|Request\s*,\s*Response\s*,\s*NextFunction)" "$file" | wc -l | xargs -I {} echo "Express middleware functions: {}"
        
        # Custom middleware definitions
        grep -E "(export\s+)?(const|function)\s+\w*[Mm]iddleware" "$file" | sed -E 's/.*(const|function)\s+([a-zA-Z_][a-zA-Z0-9_]*).*/\2/'
    } | grep -v "^$" | sort -u
}

extract_services() {
    local file="$1"
    {
        # Service class patterns
        grep -E "class\s+\w*Service" "$file" | sed -E 's/.*class\s+([a-zA-Z_][a-zA-Z0-9_]*Service).*/\1/'
        
        # Service function patterns
        grep -E "(export\s+)?(const|function)\s+\w*Service" "$file" | sed -E 's/.*(const|function)\s+([a-zA-Z_][a-zA-Z0-9_]*Service).*/\2/'
        
        # API service patterns
        grep -E "(export\s+)?(const|function)\s+\w*Api" "$file" | sed -E 's/.*(const|function)\s+([a-zA-Z_][a-zA-Z0-9_]*Api).*/\2/'
    } | grep -v "^$" | sort -u
}

extract_decorators() {
    local file="$1"
    grep -E "@[A-Z][a-zA-Z]*" "$file" | sed -E 's/.*(@[A-Z][a-zA-Z]*).*/\1/' | sort -u
}

extract_environment_vars() {
    local file="$1"
    grep -E "process\.env\.[A-Z_]+" "$file" | sed -E 's/.*process\.env\.([A-Z_]+).*/\1/' | sort -u
}

extract_error_handlers() {
    local file="$1"
    {
        grep -E "catch\s*\(" "$file" | wc -l | xargs -I {} echo "Try-catch blocks: {}"
        grep -E "throw\s+new\s+Error" "$file" | wc -l | xargs -I {} echo "Error throws: {}"
        grep -E "Error\s*\(" "$file" | wc -l | xargs -I {} echo "Error instances: {}"
    } | grep -v ": 0$"
}

# ====================================================================
# FUNCIÓN PRINCIPAL DE ANÁLISIS
# ====================================================================

analyze_file() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Información básica del archivo
    local filename=$(basename "$file")
    local relative_path=$(realpath --relative-to="$PWD" "$file")
    local file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "unknown")
    local line_count=$(wc -l < "$file")
    local non_empty_lines=$(grep -c '\S' "$file")
    local char_count=$(wc -c < "$file")
    
    cat > "$temp_file" << EOF

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: $filename
 * Ruta: $relative_path
 * Tamaño: $file_size bytes
 * Líneas totales: $line_count
 * Líneas no vacías: $non_empty_lines
 * Caracteres: $char_count
 * Última actualización: $TIMESTAMP
 * 
EOF

    # Análisis de imports
    local imports=$(extract_imports "$file")
    if [[ -n "$imports" ]]; then
        echo " * 📦 IMPORTS:" >> "$temp_file"
        while IFS= read -r import; do
            echo " *   - $import" >> "$temp_file"
        done <<< "$imports"
        echo " * " >> "$temp_file"
    fi

    # Análisis de exports
    local exports=$(extract_exports "$file")
    if [[ -n "$exports" ]]; then
        echo " * 📤 EXPORTS:" >> "$temp_file"
        while IFS= read -r export; do
            echo " *   - $export" >> "$temp_file"
        done <<< "$exports"
        echo " * " >> "$temp_file"
    fi

    # Análisis de clases
    local classes=$(extract_classes "$file")
    if [[ -n "$classes" ]]; then
        echo " * 🏛️  CLASES:" >> "$temp_file"
        while IFS= read -r class; do
            echo " *   - $class" >> "$temp_file"
        done <<< "$classes"
        echo " * " >> "$temp_file"
    fi

    # Análisis de interfaces
    local interfaces=$(extract_interfaces "$file")
    if [[ -n "$interfaces" ]]; then
        echo " * 📋 INTERFACES:" >> "$temp_file"
        while IFS= read -r interface; do
            echo " *   - $interface" >> "$temp_file"
        done <<< "$interfaces"
        echo " * " >> "$temp_file"
    fi

    # Análisis de tipos
    local types=$(extract_types "$file")
    if [[ -n "$types" ]]; then
        echo " * 🔖 TIPOS:" >> "$temp_file"
        while IFS= read -r type; do
            echo " *   - $type" >> "$temp_file"
        done <<< "$types"
        echo " * " >> "$temp_file"
    fi

    # Análisis de enums
    local enums=$(extract_enums "$file")
    if [[ -n "$enums" ]]; then
        echo " * 📝 ENUMS:" >> "$temp_file"
        while IFS= read -r enum; do
            echo " *   - $enum" >> "$temp_file"
        done <<< "$enums"
        echo " * " >> "$temp_file"
    fi

    # Análisis de funciones
    local functions=$(extract_functions "$file")
    if [[ -n "$functions" ]]; then
        echo " * ⚡ FUNCIONES:" >> "$temp_file"
        while IFS= read -r function; do
            echo " *   - $function()" >> "$temp_file"
        done <<< "$functions"
        echo " * " >> "$temp_file"
    fi

    # Análisis de constantes
    local constants=$(extract_constants "$file")
    if [[ -n "$constants" ]]; then
        echo " * 🔒 CONSTANTES:" >> "$temp_file"
        while IFS= read -r constant; do
            echo " *   - $constant" >> "$temp_file"
        done <<< "$constants"
        echo " * " >> "$temp_file"
    fi

    # Análisis de APIs
    local apis=$(extract_api_endpoints "$file")
    if [[ -n "$apis" ]]; then
        echo " * 🌐 ENDPOINTS/APIs:" >> "$temp_file"
        while IFS= read -r api; do
            echo " *   - $api" >> "$temp_file"
        done <<< "$apis"
        echo " * " >> "$temp_file"
    fi

    # Análisis de React hooks
    local hooks=$(extract_react_hooks "$file")
    if [[ -n "$hooks" ]]; then
        echo " * 🎣 REACT HOOKS:" >> "$temp_file"
        while IFS= read -r hook; do
            echo " *   - $hook" >> "$temp_file"
        done <<< "$hooks"
        echo " * " >> "$temp_file"
    fi

    # Análisis de componentes React
    local components=$(extract_react_components "$file")
    if [[ -n "$components" ]]; then
        echo " * ⚛️  COMPONENTES REACT:" >> "$temp_file"
        while IFS= read -r component; do
            echo " *   - $component" >> "$temp_file"
        done <<< "$components"
        echo " * " >> "$temp_file"
    fi

    # Análisis de modelos de base de datos
    local models=$(extract_database_models "$file")
    if [[ -n "$models" ]]; then
        echo " * 🗄️  MODELOS/BD:" >> "$temp_file"
        while IFS= read -r model; do
            echo " *   - $model" >> "$temp_file"
        done <<< "$models"
        echo " * " >> "$temp_file"
    fi

    # Análisis de middlewares
    local middlewares=$(extract_middlewares "$file")
    if [[ -n "$middlewares" ]]; then
        echo " * 🔀 MIDDLEWARES:" >> "$temp_file"
        while IFS= read -r middleware; do
            echo " *   - $middleware" >> "$temp_file"
        done <<< "$middlewares"
        echo " * " >> "$temp_file"
    fi

    # Análisis de servicios
    local services=$(extract_services "$file")
    if [[ -n "$services" ]]; then
        echo " * 🔧 SERVICIOS:" >> "$temp_file"
        while IFS= read -r service; do
            echo " *   - $service" >> "$temp_file"
        done <<< "$services"
        echo " * " >> "$temp_file"
    fi

    # Análisis de decoradores
    local decorators=$(extract_decorators "$file")
    if [[ -n "$decorators" ]]; then
        echo " * 🎭 DECORADORES:" >> "$temp_file"
        while IFS= read -r decorator; do
            echo " *   - $decorator" >> "$temp_file"
        done <<< "$decorators"
        echo " * " >> "$temp_file"
    fi

    # Análisis de variables de entorno
    local env_vars=$(extract_environment_vars "$file")
    if [[ -n "$env_vars" ]]; then
        echo " * 🌍 VARIABLES DE ENTORNO:" >> "$temp_file"
        while IFS= read -r env_var; do
            echo " *   - $env_var" >> "$temp_file"
        done <<< "$env_vars"
        echo " * " >> "$temp_file"
    fi

    # Análisis de manejo de errores
    local error_handlers=$(extract_error_handlers "$file")
    if [[ -n "$error_handlers" ]]; then
        echo " * ⚠️  MANEJO DE ERRORES:" >> "$temp_file"
        while IFS= read -r error_handler; do
            echo " *   - $error_handler" >> "$temp_file"
        done <<< "$error_handlers"
        echo " * " >> "$temp_file"
    fi

    # Análisis de dependencias detectadas
    echo " * 📊 ANÁLISIS DE DEPENDENCIAS:" >> "$temp_file"
    if grep -q "express" "$file"; then echo " *   - Express.js detectado" >> "$temp_file"; fi
    if grep -q "react" "$file"; then echo " *   - React detectado" >> "$temp_file"; fi
    if grep -q "mongoose" "$file"; then echo " *   - Mongoose detectado" >> "$temp_file"; fi
    if grep -q "axios" "$file"; then echo " *   - Axios detectado" >> "$temp_file"; fi
    if grep -q "lodash" "$file"; then echo " *   - Lodash detectado" >> "$temp_file"; fi
    if grep -q "moment" "$file"; then echo " *   - Moment.js detectado" >> "$temp_file"; fi
    if grep -q "jwt" "$file"; then echo " *   - JWT detectado" >> "$temp_file"; fi
    if grep -q "bcrypt" "$file"; then echo " *   - Bcrypt detectado" >> "$temp_file"; fi
    if grep -q "socket.io" "$file"; then echo " *   - Socket.io detectado" >> "$temp_file"; fi
    echo " * " >> "$temp_file"

    # Métricas finales
    local complexity_score=$(($(grep -c "if\|for\|while\|switch" "$file") + $(grep -c "function\|=>" "$file")))
    echo " * 📈 MÉTRICAS DE COMPLEJIDAD:" >> "$temp_file"
    echo " *   - Puntuación de complejidad: $complexity_score" >> "$temp_file"
    echo " *   - Ratio código/comentarios: $(echo "scale=2; $non_empty_lines / $(grep -c "//" "$file" | awk '{print ($1 == 0) ? 1 : $1}')" | bc 2>/dev/null || echo "N/A")" >> "$temp_file"
    echo " * " >> "$temp_file"
    echo " * 🤖 Generado automáticamente por TypeScript Advanced Documenter" >> "$temp_file"
    echo " */" >> "$temp_file"

    echo "$temp_file"
}

# ====================================================================
# FUNCIÓN DE PROCESAMIENTO DE ARCHIVOS
# ====================================================================

process_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        log_message "Archivo no encontrado: $file" "ERROR"
        return 1
    fi

    log_message "Procesando: $file" "INFO"
    
    # Verificar si ya tiene documentación automática
    if grep -q "=== DOCUMENTACIÓN AUTOMÁTICA" "$file"; then
        log_message "Actualizando documentación existente en: $file" "WARNING"
        
        # Crear archivo temporal sin la documentación anterior
        local temp_original=$(mktemp)
        sed '/\/\* === DOCUMENTACIÓN AUTOMÁTICA/,$d' "$file" > "$temp_original"
        
        # Generar nueva documentación
        local doc_file=$(analyze_file "$temp_original")
        
        # Combinar archivo original sin documentación + nueva documentación
        cat "$temp_original" "$doc_file" > "$file"
        
        rm "$temp_original" "$doc_file"
    else
        log_message "Agregando nueva documentación a: $file" "INFO"
        
        # Generar documentación
        local doc_file=$(analyze_file "$file")
        
        # Agregar documentación al final del archivo
        cat "$doc_file" >> "$file"
        
        rm "$doc_file"
    fi
    
    ((PROCESSED_FILES++))
    log_message "Archivo procesado exitosamente: $file" "SUCCESS"
}

# ====================================================================
# FUNCIÓN PRINCIPAL RECURSIVA
# ====================================================================

process_directory() {
    local dir="$1"
    
    if [[ ! -d "$dir" ]]; then
        log_message "Directorio no encontrado: $dir" "ERROR"
        return 1
    fi

    # Procesar archivos .ts en el directorio actual
    for file in "$dir"/*.ts; do
        [[ -f "$file" ]] || continue
        [[ "$file" == *.d.ts ]] && continue  # Saltar archivos de definición
        
        ((TOTAL_FILES++))
        process_file "$file"
    done

    # Procesar subdirectorios recursivamente
    for subdir in "$dir"*/; do
        [[ -d "$subdir" ]] || continue
        
        # Saltar directorios comunes que no necesitan documentación
        local dirname=$(basename "$subdir")
        case "$dirname" in
            node_modules|.git|dist|build|coverage|.nyc_output|.next|out)
                log_message "Saltando directorio: $subdir" "WARNING"
                continue
                ;;
        esac
        
        process_directory "$subdir"
    done
}

# ====================================================================
# FUNCIÓN PRINCIPAL
# ====================================================================

main() {
    print_header
    
    # Verificar si el directorio existe
    if [[ ! -d "$SRC_DIR" ]]; then
        log_message "El directorio $SRC_DIR no existe" "ERROR"
        echo -e "${RED}Uso: $0 [directorio]${NC}"
        echo -e "${YELLOW}Ejemplo: $0 ./src${NC}"
        exit 1
    fi

    # Inicializar log
    echo "Iniciando documentación automática de TypeScript - $TIMESTAMP" > "$LOG_FILE"
    
    # Procesar directorio
    log_message "Iniciando procesamiento del directorio: $SRC_DIR" "INFO"
    process_directory "$SRC_DIR"
    
    # Mostrar estadísticas finales
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${GREEN}📈 ESTADÍSTICAS FINALES${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${CYAN}📁 Directorio procesado: ${SRC_DIR}${NC}"
    echo -e "${CYAN}📄 Archivos encontrados: ${TOTAL_FILES}${NC}"
    echo -e "${CYAN}✅ Archivos procesados: ${PROCESSED_FILES}${NC}"
    echo -e "${CYAN}📋 Log guardado en: ${LOG_FILE}${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
    
    if [[ $PROCESSED_FILES -gt 0 ]]; then
        log_message "Documentación completada exitosamente" "SUCCESS"
        echo -e "${GREEN}🎉 ¡Documentación completada exitosamente!${NC}"
    else
        log_message "No se encontraron archivos TypeScript para procesar" "WARNING"
    fi
}

# ====================================================================
# EJECUCIÓN DEL SCRIPT
# ====================================================================

# Verificar dependencias
if ! command -v bc &> /dev/null; then
    echo -e "${YELLOW}⚠️  bc no está instalado. Algunas métricas pueden no calcularse correctamente.${NC}"
fi

# Ejecutar función principal
main "$@"

# Salir con código de éxito
exit 0