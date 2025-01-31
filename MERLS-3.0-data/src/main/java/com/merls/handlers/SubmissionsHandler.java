package com.merls.handlers;

import java.io.IOException;
import java.util.HashMap;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import java.sql.SQLException;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.merls.business.Participant;
import com.merls.business.Submission;
import com.merls.data.ParticipantDB;
import com.merls.data.SubmissionsDB;

public class SubmissionsHandler {

	private static final ObjectMapper objectMapper = new ObjectMapper();

	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
		APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
		Map<String, String> headers = new HashMap<>();
		headers.put("Content-Type", "application/json");
		headers.put("Access-Control-Allow-Origin", "*");
		headers.put("Access-Control-Allow-Headers", "Content-Type,Authorization");
		response.setHeaders(headers);

		context.getLogger().log("Received request body: " + request.getBody());

		Submission submission;
		try {
			submission = parseAndValidateSubmission(request.getBody());
		} catch (Exception e) {
			return new APIGatewayProxyResponseEvent()
					.withStatusCode(400)
					.withBody("Validation error: " + e.getMessage());
		}

		try {
			String participantId = submission.getParticipantId();
			Participant participant = new Participant(participantId, null, false, false, false);
			ParticipantDB userDB = new ParticipantDB();
			if (!userDB.participantIfValid(participant)) {
				return new APIGatewayProxyResponseEvent()
						.withStatusCode(404)
						.withBody("Participant not found");
			}

			Map<Integer, Integer> answers = submission.getUserAns();
			Boolean isEN = submission.isEN();

			if (submission.getSubmissionType().equals("story")) {
				ParticipantDB.updateCompleted(participantId, "story", !isEN ? "cn" : "en");
			}
			else if (submission.isAudioTest()) {
				ParticipantDB.updateCompleted(participantId, "repetition", !isEN ? "cn" : "en");
			}
			else {
				ParticipantDB.updateCompleted(participantId, "matching", !isEN ? "cn" : "en");
			}

//			context.getLogger().log("Participant ID: " + participantId + ", Is English: " + isEN + ", Answers: " + answers.toString());
			response.setBody(String.valueOf(SubmissionsDB.postSubmissionsToDB(submission)));
			response.setStatusCode(200);
			System.out.println("Call is succeed");
		} catch (Exception e) {
//			context.getLogger().log("Error: " + e.getMessage());
			response.setStatusCode(500);
			response.setBody(e.getMessage());
		}

		return response;
	}

	private Submission parseAndValidateSubmission(String body) throws IOException {
		HashMap<String, Object> requestBody = objectMapper.readValue(body, new TypeReference<HashMap<String, Object>>() {});
		validateRequestFields(requestBody);
		return objectMapper.readValue(body, Submission.class);
	}

	private void validateRequestFields(HashMap<String, Object> requestBody) {
		// Check for participantId
		if (!requestBody.containsKey("participantId") || !(requestBody.get("participantId") instanceof String)) {
			throw new IllegalArgumentException("participantId is missing or not a string");
		}

		// Only validate userAns if isAudioTest is false
		boolean isAudioTest = (Boolean) requestBody.get("isAudioTest");
		String submissionType = requestBody.get("submissionType").toString();
		if (!submissionType.equals("story")) {
			if (!isAudioTest) {
				if (!requestBody.containsKey("userAns") || !(requestBody.get("userAns") instanceof HashMap)) {
					throw new IllegalArgumentException("userAns is missing or not a valid map");
				}
			} else {
				// For audio test, validate audioSubmissionList
				if (!requestBody.containsKey("audioSubmissionList") || !(requestBody.get("audioSubmissionList") instanceof HashMap)) {
					throw new IllegalArgumentException("audioSubmissionList is missing or not a valid map");
				}
			}
		}

		// Check for isEN
		if (!requestBody.containsKey("isEN") || !(requestBody.get("isEN") instanceof Boolean)) {
			throw new IllegalArgumentException("isEN is missing or not a boolean");
		}
	}

	public static void main(String[] args) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Submission requestObject = new Submission();
			HashMap<Integer, Integer> answer = new HashMap<Integer, Integer>();
			answer.put(1, 1);
			answer.put(2, 2);
			requestObject.setParticipantId("lucy");
			requestObject.setUserAns(answer); // Example answers
			requestObject.setEN(true);
			String jsonPayload = objectMapper.writeValueAsString(requestObject);
			APIGatewayProxyRequestEvent requestEvent = new APIGatewayProxyRequestEvent();
			requestEvent.setBody(jsonPayload);
			SubmissionsHandler handler = new SubmissionsHandler();
			var response = handler.handleRequest(requestEvent, null);
			System.out.println("Lambda Response: " + response.getBody());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
