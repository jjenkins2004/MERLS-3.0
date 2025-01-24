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

        //context.getLogger().log("Received request body: " + input);

        Map<String, String> queryParams = (Map<String, String>) input.get("queryStringParameters");

        if (queryParams == null || !queryParams.containsKey("language")) {
            return createErrorResponse("Missing parameter: language");
        }
        else if (!queryParams.containsKey("type")) {
            return createErrorResponse("Missign parameter: type");
        }

        String language = queryParams.get("language");
        if (!language.equals("CN") && !language.equals("EN")) {
            return createErrorResponse("Invalid parameter: language must be either 'CN' or 'EN'");
        }

        String type = queryParams.get("type");
        if (!type.equals("repetition") && !type.equals("matching")
                && !type.equals("story")) {
            return createErrorResponse("Invalid parameter: type must be either 'repetition' or 'matching' " +
                    "or 'story'");
        }

        String response = getQuestionsFromDB(type, language);
        return response;
    }

    private String getQuestionsFromDB(String type, String language) {
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
            // Adjust the query based on the language and type parameter
            String tableName;
            String query;
            if (type.equals("matching")) {
                tableName = language.equals("CN") ? "chinese_questions" : "english_questions";
                query = "SELECT * FROM " + tableName + " WHERE is_active = true ORDER BY question_id";
            }
            else if (type.equals("repetition")) {
                tableName = language.equals("CN") ? "chinese_repetition" : "english_repetition";
                query = "SELECT * FROM " + tableName + " WHERE is_active = true ORDER BY question_id";
            }
            else if (type.equals("story")) {
                tableName = "story_test"; // by default english
                query = "SELECT * FROM " + tableName + " WHERE is_active = true ORDER BY story_id";
            }
            else {
                return "";
            }

            ResultSet rs = stmt.executeQuery(query);

            JSONArray jsonArray = new JSONArray();
            if (type.equals("matching")) {
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
            }
            else if (type.equals("repetition")) {
                while (rs.next()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("question_id", rs.getInt("question_id"));
                    jsonObject.put("question_link", rs.getString("question_link"));
                    jsonArray.put(jsonObject);
                }
            }
            else if (type.equals("story")) {
                while (rs.next()) {
                    //creating story object
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("story_id", rs.getInt("story_id"));
                    jsonObject.put("story_title", rs.getString("story_title"));
                    jsonObject.put("narration_audios", new JSONArray(rs.getArray("narration_audios").getArray()));
                    jsonObject.put("image_links", new JSONArray(rs.getArray("image_links").getArray()));

                    //finding all the questions with foreign key to this story object
                    tableName = "story_questions";
                    query = "SELECT * FROM " + tableName + " WHERE story_id = " + jsonObject.get("story_id") + " ORDER BY question_id ASC";
                    Statement questionsStmt = conn.createStatement();
                    ResultSet questionsRS = questionsStmt.executeQuery(query);
                    JSONArray questions = new JSONArray();
                    int id = 1;
                    while (questionsRS.next()) {
                        JSONObject question = new JSONObject();
                        question.put("question_id", id);
                        question.put("question_text", questionsRS.getString("question_text"));
                        String[] imageLinks = null;
                        if (questionsRS.getArray("image_links") != null) {
                            imageLinks = (String[]) questionsRS.getArray("image_links").getArray();
                        } else {
                            imageLinks = new String[0]; // Default to an empty array
                        }
                        question.put("image_links", new JSONArray(imageLinks));

                        question.put("question_audio", questionsRS.getString("question_audio"));
                        questions.put(question);
                        id++;
                    }

                    //adding questions into story object
                    jsonObject.put("questions", questions);
                    jsonArray.put(jsonObject);
                }
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
        Map<String, Object> testInput = Map.of("queryStringParameters", Map.of("language", "EN", "type", "story"));
        System.out.println(handler.handleRequest(testInput, null));
    }
}
