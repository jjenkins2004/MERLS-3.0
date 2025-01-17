package com.merls.handlers;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.gson.Gson;
import java.util.Base64;
import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.merls.business.*;

public class AudioUploadHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
//    private final String bucketName = "merls-audio";
    private String bucketName = "merls-audio";
    private final Gson gson = new Gson();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Credentials", "true");
        response.setHeaders(headers);

        try {
            context.getLogger().log("Request body from java : " + request.getBody());

            if (request.getBody() == null) {
                throw new IllegalArgumentException("Request body is null");
            }

            // Parse request body
            AudioUploadRequest uploadRequest = gson.fromJson(request.getBody(), AudioUploadRequest.class);

            // Validate the parsed request
            if (uploadRequest == null) {
                throw new IllegalArgumentException("Failed to parse upload request");
            }
            if (uploadRequest.getAudioData() == null) {
                throw new IllegalArgumentException("Audio data is null");
            }

            bucketName = uploadRequest.getBucketName();

            context.getLogger().log("Parsed request: " + uploadRequest.toString());

            // Extract base64 data - remove data:audio/webm;base64, prefix
            String base64Data = uploadRequest.getAudioData().split(",")[1];
            byte[] audioData = Base64.getDecoder().decode(base64Data);

            // Generate unique key for S3
            String userId = uploadRequest.getUserId();
            String questionId = String.valueOf(uploadRequest.getQuestionId());
            String fileType = uploadRequest.getFileType();

            SimpleDateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy");
            String datePath = dateFormat.format(new Date());
            String key = String.format("%s/user_%s/question_%s_%d.webm",
                    datePath,
                    userId,
                    questionId,
                    System.currentTimeMillis()
            );

            // Set up metadata
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(uploadRequest.getFileType());
            metadata.setContentLength(audioData.length);

            // Upload to S3
            PutObjectRequest putRequest = new PutObjectRequest(
                    bucketName,
                    key,
                    new ByteArrayInputStream(audioData),
                    metadata
            );
            s3Client.putObject(putRequest);

            // Generate pre-signed URL (optional)
            String url = s3Client.generatePresignedUrl(
                    bucketName,
                    key,
                    java.util.Date.from(java.time.Instant.now().plusSeconds(3600))
            ).toString();

            // Create success response
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Upload successful");
            responseBody.put("url", url);
            responseBody.put("key", key);

            response.setStatusCode(200);
            response.setBody(gson.toJson(responseBody));

        } catch (Exception e) {
            context.getLogger().log("Error: " + e.getMessage());

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Upload failed");
            errorResponse.put("error", e.getMessage());

            response.setStatusCode(500);
            response.setBody(gson.toJson(errorResponse));
        }

        return response;
    }
}