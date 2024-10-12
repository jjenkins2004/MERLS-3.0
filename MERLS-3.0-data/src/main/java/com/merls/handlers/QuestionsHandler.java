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

public class QuestionsHandler implements RequestHandler<Map<String, Object>, String> {

    @Override
    public String handleRequest(Map<String, Object> input, Context context) {
        Map<String, String> queryParams = (Map<String, String>) input.get("queryStringParameters");
        if (queryParams == null || !queryParams.containsKey("language")) {
            return createErrorResponse("Missing parameter: language");
        }

        String language = queryParams.get("language");
        if (!language.equals("CN") && !language.equals("EN")) {
            return createErrorResponse("Invalid parameter: language must be either 'CN' or 'EN'");
        }

        String response = getQuestionsFromDB(language);
        return response;
    }

    private String getQuestionsFromDB(String language) {
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
            // Adjust the query based on the language parameter
            String tableName = language.equals("CN") ? "chinese_questions" : "english_questions";
            String query = "SELECT * FROM " + tableName + " WHERE is_active = true ORDER BY question_id";
            ResultSet rs = stmt.executeQuery(query);

            JSONArray jsonArray = new JSONArray();
            while (rs.next()) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("question_id", rs.getInt("question_id"));
                jsonObject.put("question_link", rs.getString("question_link"));
                String[] options = (String[]) rs.getArray("options").getArray();
                JSONArray optionArray = new JSONArray();
                for (String option : options) {
                    optionArray.put(option);
                }
                jsonObject.put("options", optionArray);
                jsonObject.put("answer", rs.getInt("answer"));
                // Add other fields as needed
                jsonArray.put(jsonObject);
            }

            rs.close();
            stmt.close();
            conn.close();

            return jsonArray.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    private String createErrorResponse(String message) {
        JSONObject errorResponse = new JSONObject();
        errorResponse.put("error", message);
        return errorResponse.toString();
    }

    // Main method for local testing
    public static void main(String[] args) {
        QuestionsHandler handler = new QuestionsHandler();
        Map<String, Object> testInput = Map.of("queryStringParameters", Map.of("language", "CN"));
        System.out.println(handler.handleRequest(testInput, null));
    }
}