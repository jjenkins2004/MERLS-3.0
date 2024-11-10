package com.merls.handlers;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.Base64;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class ExportHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {


    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        String url = "jdbc:postgresql://merlsdb.cpuk24q4an9x.us-east-2.rds.amazonaws.com:5432/postgres";
        String username = "merls_admin";
        String password = "merlsadmin";

        String participantId = input.getQueryStringParameters().get("participant_id");
        String language = input.getQueryStringParameters().get("language");

        if (!language.toUpperCase(Locale.ROOT).equals("CN") && !language.toUpperCase(Locale.ROOT).equals("EN")) {
            APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
            response.setStatusCode(400);
            response.setBody("Invalid language parameter. Must be 'en' or 'cn'.");
            return response;
        }


        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        headers.put("Content-Disposition", "attachment; filename=\"submission.xlsx\"");
        response.setHeaders(headers);

        String submissionsQuery = "SELECT * FROM submissions WHERE participant_id = ? AND is_en = ?";
        String audioQuery = "SELECT * FROM audio_submissions WHERE participant_id = ? AND is_en = ?";


        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement submissionsStmt = conn.prepareStatement(submissionsQuery);
             PreparedStatement audioStmt = conn.prepareStatement(audioQuery);
             Workbook workbook = new XSSFWorkbook()) {

            boolean isEn = language.toUpperCase(Locale.ROOT).equals("EN");

            // Populate Submissions sheet
            submissionsStmt.setString(1, participantId);
            submissionsStmt.setBoolean(2, isEn);
            try (ResultSet submissionsRs = submissionsStmt.executeQuery()) {
                populateSheet(submissionsRs, workbook, "Submissions");
            }

            // Populate Audio Submissions sheet
            audioStmt.setString(1, participantId);
            audioStmt.setBoolean(2, isEn);
            try (ResultSet audioRs = audioStmt.executeQuery()) {
                populateSheet(audioRs, workbook, "Audio Submissions");
            }

            // Write the workbook to a byte array
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                workbook.write(baos);
                byte[] bytes = baos.toByteArray();
                String base64EncodedExcel = Base64.getEncoder().encodeToString(bytes);
                response.setBody(base64EncodedExcel);
                response.setIsBase64Encoded(true);
                response.setStatusCode(200);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatusCode(500);
            response.setBody("Error: " + e.getMessage());
        }

        return response;
    }

    private void populateSheet(ResultSet rs, Workbook workbook, String sheetName) throws SQLException {
        var sheet = workbook.createSheet(sheetName);

        // Create header row
        var headerRow = sheet.createRow(0);
        var metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();
        for (int i = 1; i <= columnCount; i++) {
            headerRow.createCell(i - 1).setCellValue(metaData.getColumnName(i));
        }

        // Populate data rows
        int rowIndex = 1;
        while (rs.next()) {
            var row = sheet.createRow(rowIndex++);
            for (int i = 1; i <= columnCount; i++) {
                var value = rs.getString(i);
                row.createCell(i - 1).setCellValue(value != null ? value : "");
            }
        }

        // Auto-size columns
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
