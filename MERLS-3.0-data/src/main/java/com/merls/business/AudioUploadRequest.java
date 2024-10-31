package com.merls.business;

public class AudioUploadRequest {
    private String fileName;
    private String fileType;
    private String audioData;
    private String userId;
    private Integer questionId;

    // Getters and setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getAudioData() { return audioData; }
    public void setAudioData(String audioData) { this.audioData = audioData; }

    public String getUserId() { return userId; }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }


    @Override
    public String toString() {
        return "AudioUploadRequest{" +
                "fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", audioData='" + (audioData != null ? "[BASE64_DATA]" : "null") + '\'' +
                '}';
    }
}