package com.merls.business;

public class AudioUploadRequest {
    private String fileName;
    private String fileType;
    private String audioData;
    private String userId;
    private Integer questionId;
    private String bucketName;

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

    public String getBucketName() { return bucketName; }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }


    @Override
    public String toString() {
        return "AudioUploadRequest{" +
                "bucketName='" + bucketName + '\'' +
                "fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", audioData='" + (audioData != null ? "[BASE64_DATA]" : "null") + '\'' +
                '}';
    }
}