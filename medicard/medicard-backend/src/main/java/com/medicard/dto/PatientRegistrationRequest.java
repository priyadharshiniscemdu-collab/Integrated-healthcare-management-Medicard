package com.medicard.dto;

import java.util.List;

public class PatientRegistrationRequest {
    private String name;
    private String cardId;
    private Integer age;
    private String gender;
    private String dob;
    private String bloodGroup;
    private Integer bpSystolic;
    private Integer bpDiastolic;
    private String sugarLevel;
    private List<String> allergies;
    private List<String> medications;
    private List<String> medicalConditions;
    private String ec1Name;
    private String ec1Rel;
    private String ec1Phone;
    private String ec2Name;
    private String doctorName;

    // Getters
    public String getName() { return name; }
    public String getCardId() { return cardId; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getDob() { return dob; }
    public String getBloodGroup() { return bloodGroup; }
    public Integer getBpSystolic() { return bpSystolic; }
    public Integer getBpDiastolic() { return bpDiastolic; }
    public String getSugarLevel() { return sugarLevel; }
    public List<String> getAllergies() { return allergies; }
    public List<String> getMedications() { return medications; }
    public List<String> getMedicalConditions() { return medicalConditions; }
    public String getEc1Name() { return ec1Name; }
    public String getEc1Rel() { return ec1Rel; }
    public String getEc1Phone() { return ec1Phone; }
    public String getEc2Name() { return ec2Name; }
    public String getDoctorName() { return doctorName; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setCardId(String cardId) { this.cardId = cardId; }
    public void setAge(Integer age) { this.age = age; }
    public void setGender(String gender) { this.gender = gender; }
    public void setDob(String dob) { this.dob = dob; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public void setBpSystolic(Integer bpSystolic) { this.bpSystolic = bpSystolic; }
    public void setBpDiastolic(Integer bpDiastolic) { this.bpDiastolic = bpDiastolic; }
    public void setSugarLevel(String sugarLevel) { this.sugarLevel = sugarLevel; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }
    public void setMedications(List<String> medications) { this.medications = medications; }
    public void setMedicalConditions(List<String> medicalConditions) { this.medicalConditions = medicalConditions; }
    public void setEc1Name(String ec1Name) { this.ec1Name = ec1Name; }
    public void setEc1Rel(String ec1Rel) { this.ec1Rel = ec1Rel; }
    public void setEc1Phone(String ec1Phone) { this.ec1Phone = ec1Phone; }
    public void setEc2Name(String ec2Name) { this.ec2Name = ec2Name; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
