package com.merls.data;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

import com.merls.business.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SubmissionsDB {
	// private final static String url = "jdbc:postgresql://merlsdb.cpuk24q4an9x.us-east-2.rds.amazonaws.com:5432/postgres";
	// private final static String username = "merls_admin";
	// private final static String password = "merlsadmin";
	private final static String url = System.getenv("DB_URL"); // DB URL from environment variable
	private final static String username = System.getenv("DB_USER"); // DB username from environment variable
	private final static String password = System.getenv("DB_PASSWORD"); // DB password from environment variable
	private static final Log log = LogFactory.getLog(SubmissionsDB.class);

	//save submission to database
	public static int postSubmissionsToDB (Submission event) throws SQLException, ClassNotFoundException {
		Connection connection = DriverManager.getConnection(url, username, password);
		PreparedStatement ps = null;

		String participantId = event.getParticipantId();
		boolean isEN = event.isEN;
		boolean isAudioTest = event.isAudioTest();
		String submissionType = event.getSubmissionType();
		log.info("Received submission - participantId:" + participantId +
				" isEN:"+isEN+" isAudioTest: "+ isAudioTest + " submissionType: " + submissionType);

		try {
			if (submissionType.equals("story")) {
				log.info("story submission");
				HashMap<Integer, HashMap<Integer, String>> storySubmissions = event.getStorySubmissionList();
				HashMap<Integer, HashMap<Integer, String>> retellSubmissions = event.getRetellSubmissionList();

      			// Handle story submissions
				if (storySubmissions != null && !storySubmissions.isEmpty()) {
					String query = "INSERT INTO PUBLIC.STORY_SUBMISSIONS(participant_id, question_id, audio_url, is_EN, story_id) " +
							"VALUES(?, ?, ?, ?, ?)";

					for (Map.Entry<Integer, HashMap<Integer, String>> storyEntry : storySubmissions.entrySet()) {
						int storyId = storyEntry.getKey();
						HashMap<Integer, String> questionSubmissions = storyEntry.getValue();

						for (Map.Entry<Integer, String> questionEntry : questionSubmissions.entrySet()) {
							int questionId = questionEntry.getKey();
							String audioUrl = questionEntry.getValue();

							ps = connection.prepareStatement(query);
							ps.setString(1, participantId);
							ps.setInt(2, questionId);
							ps.setString(3, audioUrl);
							ps.setBoolean(4, isEN);
							ps.setInt(5, storyId);
							ps.executeUpdate();
						}
					}
				} else {
					log.info("No story submissions found.");
				}

				// Handle retell submissions
				if (retellSubmissions != null && !retellSubmissions.isEmpty()) {
					String query = "INSERT INTO PUBLIC.RETELL_SUBMISSIONS(participant_id, question_id, audio_url, is_EN, story_id) " +
							"VALUES(?, ?, ?, ?, ?)";

					for (Map.Entry<Integer, HashMap<Integer, String>> storyEntry : retellSubmissions.entrySet()) {
						int storyId = storyEntry.getKey();
						HashMap<Integer, String> questionSubmissions = storyEntry.getValue();

						for (Map.Entry<Integer, String> questionEntry : questionSubmissions.entrySet()) {
							int questionId = questionEntry.getKey();
							String audioUrl = questionEntry.getValue();

							ps = connection.prepareStatement(query);
							ps.setString(1, participantId);
							ps.setInt(2, questionId);
							ps.setString(3, audioUrl);
							ps.setBoolean(4, isEN);
							ps.setInt(5, storyId);
							ps.executeUpdate();
						}
					}
				} else {
					log.info("No retell submissions found.");
				}


			}
			else if (isAudioTest) {
				log.info("audio request");

				String repetitionTable = isEN ? "english_repetition" : "chinese_repetition";
				String transcriptQuery = "SELECT question_transcript FROM PUBLIC." + repetitionTable + " WHERE question_id = ?";
				String query = "INSERT INTO PUBLIC.AUDIO_SUBMISSIONS(participant_id, question_id, audio_url, is_EN, question_transcript) " +
						"VALUES(?, ?, ?, ?, ?)";

				HashMap<Integer, String> audioSubmissions = event.getAudioSubmissionList();
				if (audioSubmissions != null && !audioSubmissions.isEmpty()) {
					for (Map.Entry<Integer, String> entry : audioSubmissions.entrySet()) {
						int questionId = entry.getKey();

						String questionTranscript = null;
						try (PreparedStatement transcriptPs = connection.prepareStatement(transcriptQuery)) {
							transcriptPs.setInt(1, questionId);
							try (ResultSet rs = transcriptPs.executeQuery()) {
								if (rs.next()) {
									questionTranscript = rs.getString("question_transcript");
								}
							}
						}

						ps = connection.prepareStatement(query);
						ps.setString(1, participantId);
						ps.setInt(2, questionId);
						ps.setString(3, entry.getValue());  // audio URL
						ps.setBoolean(4, isEN);
						ps.setString(5, questionTranscript);
						ps.executeUpdate();
						log.info("Inserted audio submission for question: " + entry.getKey());
					}
				}
			} else {
				log.info("not audio request");
				String query = "INSERT INTO PUBLIC.SUBMISSIONS(participant_id, question_id, answer, is_correct, is_EN) " +
						"VALUES(?, ?, ?, ?, ?)";

				HashMap<Integer, Integer> userAns = event.getUserAns();

				for(Map.Entry<Integer, Integer> e : userAns.entrySet()) {
					int questionId = e.getKey();
					int userAnswer = e.getValue();

					ps = connection.prepareStatement(query);
					boolean is_correct = isCorrect(questionId, userAnswer, isEN, connection);

					ps.setString(1, participantId);
					ps.setInt(2, questionId);
					ps.setInt(3, userAnswer);
					ps.setBoolean(4, is_correct);
					ps.setBoolean(5, isEN);
					ps.executeUpdate();
				}
			}
			return 1;
		} finally {
			ps.close();
			connection.close();
		}
	}

	// TO TEST and UPDATE table names once Questions tables are updated
	// method to check if participant's answer is correct
	public static boolean isCorrect(int questionId, int userAnswer, boolean isEN, Connection conn) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		int correctAnswer = 0;

		String tableName = isEN ? "english_questions" : "chinese_questions";
		String query = "SELECT answer FROM " + tableName + " WHERE question_id = '" + questionId + "'";

		// retrieve correct answer from DB
		try {
			// ps = conn.prepareStatement(query);
			System.out.println(query);
			Statement stmt = conn.createStatement();
			rs = stmt.executeQuery(query);
			if(rs.next()) {
				correctAnswer = rs.getInt("answer");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return correctAnswer == userAnswer;
	}
}