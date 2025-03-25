import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const TicketAddComponent = () => {
  const [concert, setConcert] = useState({
    cname: "",
    cprice: "",
    cplace: "",
    cdesc: "",
    category: "",
    uploadFileName: null,
    schedulesDtoList: [
      {
        totalSeats: 100,
        startTime: "",
        endTime: "",
      },
    ],
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 기본 정보 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConcert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 업로드 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setConcert((prev) => ({
        ...prev,
        uploadFileName: selectedFile.name,
      }));
    }
  };

  // 스케줄 추가 버튼
  const addSchedule = () => {
    setConcert((prev) => ({
      ...prev,
      schedulesDtoList: [
        ...prev.schedulesDtoList,
        {
          totalSeats: 100,
          startTime: "",
          endTime: "",
        },
      ],
    }));
  };

  // 스케줄 삭제 버튼
  const removeSchedule = (index) => {
    setConcert((prev) => ({
      ...prev,
      schedulesDtoList: prev.schedulesDtoList.filter((_, i) => i !== index),
    }));
  };

  // 스케줄 입력 처리
  const handleScheduleChange = (index, field, value) => {
    setConcert((prev) => {
      const updatedSchedules = [...prev.schedulesDtoList];
      updatedSchedules[index] = {
        ...updatedSchedules[index],
        [field]: value,
      };
      console.log(updatedSchedules);
      return {
        ...prev,
        schedulesDtoList: updatedSchedules,
      };
    });
  };

  // 날짜 포맷 함수 추가
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // 이미 초가 포함되어 있는지 확인
    return dateString + ":00";
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 수정된 부분: new Date()를 사용하지 않고 문자열 그대로 사용하되 초만 추가
      const formattedConcert = {
        ...concert,
        schedulesDtoList: concert.schedulesDtoList.map((schedule) => ({
          ...schedule,
          startTime: formatDate(schedule.startTime),
          endTime: formatDate(schedule.endTime),
        })),
      };
      console.log(formattedConcert.schedulesDtoList);
      const formData = new FormData();

      // concertDTO를 JSON 문자열로 변환하여 FormData에 추가
      formData.append(
        "concertDTO",
        new Blob([JSON.stringify(formattedConcert)], {
          type: "application/json",
        })
      );

      // 파일이 있으면 FormData에 파일도 추가
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://localhost:8089/admin/add/concert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("공연이 성공적으로 등록되었습니다!");
      // 폼 초기화
      setConcert({
        cname: "",
        cprice: "",
        cplace: "",
        cdesc: "",
        category: "",
        uploadFileName: null,
        schedulesDtoList: [
          {
            totalSeats: 100,
            startTime: "",
            endTime: "",
          },
        ],
      });
      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("공연 등록 오류:", err);
      setError(
        "공연 등록 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // 모든 필드 검증
  const validateForm = () => {
    if (
      !concert.cname ||
      !concert.cprice ||
      !concert.cplace ||
      !concert.cdesc ||
      !concert.category
    ) {
      return false;
    }

    // 모든 스케줄이 유효한지 확인
    for (const schedule of concert.schedulesDtoList) {
      if (!schedule.startTime || !schedule.endTime || !schedule.totalSeats) {
        return false;
      }
    }

    return true;
  };

  const categories = ["뮤지컬", "연극", "클래식", "콘서트", "기타"];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          공연 상품 등록
        </Typography>

        {error && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              bgcolor: "error.light",
              color: "error.dark",
              borderRadius: 1,
            }}
          >
            {error}
          </Box>
        )}

        {success && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              bgcolor: "success.light",
              color: "success.dark",
              borderRadius: 1,
            }}
          >
            {success}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 기본 정보 섹션 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                기본 정보
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="공연 이름"
                name="cname"
                value={concert.cname}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="공연 가격"
                name="cprice"
                value={concert.cprice}
                onChange={handleInputChange}
                placeholder="예: 50,000원"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="공연 장소"
                name="cplace"
                value={concert.cplace}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>카테고리</InputLabel>
                <Select
                  name="category"
                  value={concert.category}
                  onChange={handleInputChange}
                  label="카테고리"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="공연 설명"
                name="cdesc"
                value={concert.cdesc}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                  포스터 이미지 업로드
                </Button>
              </label>
              {concert.uploadFileName && (
                <Typography variant="body2" component="span">
                  {concert.uploadFileName}
                </Typography>
              )}
            </Grid>

            {previewUrl && (
              <Grid item xs={12} sm={6}>
                <img
                  src={previewUrl}
                  alt="포스터 미리보기"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Grid>
            )}

            {/* 공연 스케줄 섹션 */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">공연 스케줄</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addSchedule}
                >
                  스케줄 추가
                </Button>
              </Box>

              {concert.schedulesDtoList.map((schedule, index) => (
                <Paper
                  key={index}
                  sx={{ p: 2, mb: 2, position: "relative", bgcolor: "grey.50" }}
                >
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => removeSchedule(index)}
                    disabled={concert.schedulesDtoList.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        스케줄 #{index + 1}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="시작 시간"
                        type="datetime-local"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="종료 시간"
                        type="datetime-local"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "endTime", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        label="총 좌석 수"
                        value={schedule.totalSeats}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "totalSeats",
                            parseInt(e.target.value, 10)
                          )
                        }
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || !validateForm()}
                >
                  {loading ? "등록 중..." : "공연 등록하기"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TicketAddComponent;
