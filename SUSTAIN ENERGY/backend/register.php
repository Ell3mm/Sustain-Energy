<?php
// Simple placeholder handler for registration.
$company = isset($_POST["company_name"]) ? trim($_POST["company_name"]) : "";
$contact = isset($_POST["contact_person"]) ? trim($_POST["contact_person"]) : "";
$email = isset($_POST["email"]) ? trim($_POST["email"]) : "";

header("Content-Type: text/plain");

echo "Registration received.\n";
echo "Company: " . $company . "\n";
echo "Contact: " . $contact . "\n";
echo "Email: " . $email . "\n";
echo "This is a placeholder script for the project skeleton.\n";
?>
