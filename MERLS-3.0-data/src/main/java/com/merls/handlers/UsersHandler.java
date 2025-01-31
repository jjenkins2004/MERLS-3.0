package com.merls.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Map;

public class UsersHandler implements RequestHandler<Map<String, Object>, String> {

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        // Extracting query parameters from the input
        Map<String, String> queryParams = (Map<String, String>) input.get("queryStringParameters");
        String participantId = queryParams != null ? queryParams.getOrDefault("participant_id", "") : "";
        String participantName = queryParams != null ? queryParams.getOrDefault("participant_name", "") : "";

        String response = getUsersFromDB(participantId, participantName);
        return response;
    }

    private String getUsersFromDB(String participantId, String participantName) {
        // Bad practice. We should store database credentials as environment variables in your AWS Lambda function's configuration
        String url = "jdbc:postgresql://merlsdb.cpuk24q4an9x.us-east-2.rds.amazonaws.com:5432/postgres";
        String username = "merls_admin";
        String password = "merlsadmin";

        // String url = System.getenv("DB_URL"); // DB URL from environment variable
        // String username = System.getenv("DB_USER"); // DB username from environment variable
        // String password = System.getenv("DB_PASSWORD"); // DB password from environment variable

        try {
            Connection conn = DriverManager.getConnection(url, username, password);
            Statement stmt = conn.createStatement();
            StringBuilder query = new StringBuilder("SELECT * FROM participants WHERE is_active = true");

            if (!participantId.isEmpty()) {
                query.append(" AND participant_id = '").append(participantId).append("'");
            }
            if (!participantName.isEmpty()) {
                query.append(" AND participant_name = '").append(participantName).append("'");
            }

            System.out.println("Executing query: " + query.toString()); // Debugging output

            ResultSet rs = stmt.executeQuery(query.toString());

            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("participant_id", rs.getString("participant_id"));
                jsonObject.put("participant_name", rs.getString("participant_name"));
                jsonObject.put("completed_matching_cn", rs.getBoolean("completed_matching_cn"));
                jsonObject.put("completed_matching_en", rs.getBoolean("completed_matching_en"));
                jsonObject.put("completed_repetition_cn", rs.getBoolean("completed_repetition_cn"));
                jsonObject.put("completed_repetition_en", rs.getBoolean("completed_repetition_en"));
                jsonObject.put("completed_story_en", rs.getBoolean("completed_story_en"));
                jsonObject.put("is_active", rs.getBoolean("is_active"));
                jsonArray.put(jsonObject);
            }

            rs.close();
            stmt.close();
            conn.close();

            return jsonArray.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Main method for local testing
    public static void main(String[] args) {
        UsersHandler handler = new UsersHandler();
        JSONObject testInput = new JSONObject();
        testInput.put("participant_id", "lucy"); // Optional parameter
//        testInput.put("participant_name", "John Doe"); // Optional parameter
        System.out.println(handler.handleRequest(Map.of("queryStringParameters", testInput.toMap()), null));
    }
}
