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

        String query = "SELECT * FROM submissions WHERE participant_id = ? AND is_en = ?";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            boolean isEn = language.toUpperCase(Locale.ROOT) == "EN";
            stmt.setString(1, participantId);
            stmt.setBoolean(2, isEn);

            try (ResultSet rs = stmt.executeQuery();
                 Workbook workbook = new XSSFWorkbook()) {

                // Create an Excel sheet and populate it with data
                var sheet = workbook.createSheet("Submission");

                var headerRow = sheet.createRow(0);
                var metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();
                for (int i = 1; i <= columnCount; i++) {
                    headerRow.createCell(i - 1).setCellValue(metaData.getColumnName(i));
                }

                int rowIndex = 1;
                while (rs.next()) {
                    var row = sheet.createRow(rowIndex++);
                    for (int i = 1; i <= columnCount; i++) {
                        row.createCell(i - 1).setCellValue(rs.getString(i));
                    }
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
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatusCode(500);
            response.setBody("Error: " + e.getMessage());
        }

        return response;
    }
}
