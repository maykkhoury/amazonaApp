<?php
header("Content-Type: application/json");

$debugFile = $_SERVER['DOCUMENT_ROOT'] . '/tmp/debug_headers.txt';
file_put_contents($debugFile, print_r($_SERVER, true));

// Allow requests from any origin (or restrict to your app's origin if needed)
header("Access-Control-Allow-Origin: *");

// Allow specific methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow headers used in your app (e.g., X-API-KEY)
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY, API_KEY");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// CONFIG
define("API_KEY", "3e04f8c2-5d4b-4f11-94d8-a5b79f4d123a"); // Replace with your actual token
define("DB_PATH", "/home/happywallpaints/mobilesync/amazonaDB.db"); 
define("VERSION_FILE_PATH", "/home/happywallpaints/mobilesync/version.txt");

error_log(print_r(getallheaders(), true));

// ====== AUTHENTICATION ======
$auth = $_SERVER['HTTP_X_API_KEY'] ?? null;
if ($auth !== API_KEY) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Unauthorized access'
    ]);
    exit;
}


try {
    $version = '0'; // default fallback
    if (file_exists(VERSION_FILE_PATH)) {
        $versionContent = trim(file_get_contents(VERSION_FILE_PATH));
        if (!empty($versionContent)) {
            $version = $versionContent;
        }
    }
    
    $db = new PDO("sqlite:" . DB_PATH);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get user-created tables (exclude SQLite internal ones)
    $query = "
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' 
        AND LOWER(name) != 'updatetable'
        AND name NOT LIKE 'sqlite_%'
        AND name NOT LIKE 'android_metadata'
        ORDER BY name;
    ";

    $stmt = $db->query($query);
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        "success" => true,
        'version' => $version,
        "tables" => $tables
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
