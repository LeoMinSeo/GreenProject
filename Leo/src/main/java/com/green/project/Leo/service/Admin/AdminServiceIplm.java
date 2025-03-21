package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.admin.AdminConcertDTO;
import com.green.project.Leo.dto.admin.AdminProductDTO;
import com.green.project.Leo.dto.concert.ConcertDTO;
import com.green.project.Leo.dto.concert.ConcertScheduleDTO;

import com.green.project.Leo.dto.product.ProductDTO;

import com.green.project.Leo.entity.concert.Concert;
import com.green.project.Leo.entity.concert.ConcertImage;
import com.green.project.Leo.entity.concert.ConcertSchedule;
import com.green.project.Leo.entity.concert.ConcertStatus;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.repository.concert.ConcertImageRepository;
import com.green.project.Leo.repository.concert.ConcertRepository;
import com.green.project.Leo.repository.concert.ConcertScheduleRepository;

import com.green.project.Leo.repository.product.ProductImageRepository;

import com.green.project.Leo.repository.product.ProductRepository;
import com.green.project.Leo.util.CustomConcertFileUtil;
import com.green.project.Leo.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;



import java.util.ArrayList;
import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceIplm implements AdminService{
    private final ProductRepository productRepository;
    private final CustomFileUtil fileUtil;
    private final ProductImageRepository imageRepository;
    private final ModelMapper modelMapper;
    private final ConcertRepository concertRepository;
    private final CustomConcertFileUtil concertFileUtil;
    private final ConcertImageRepository concertImageRepository;
    private final ConcertScheduleRepository scheduleRepository;
    @Override
    public void addProduct(ProductDTO dto) {

        //상품정보 저장 엔티티로
        Product product = Product.builder()
                .pName(dto.getPname())
                .pdesc(dto.getPdesc())
                .pPrice(dto.getPrice())
                .pStock(dto.getPstock())
                .category(dto.getCategory())
                .build();

        //상품정보를 디비에 저장
        Product result = productRepository.save(product);

        //상품 이미지 저장 로직
        //dto에 받아온 파일을 먼저 파일로 저장후 파일이름을 받음
        if(!dto.getFiles().isEmpty()) {
            List<String> filelist = fileUtil.saveFiles(dto.getFiles());
            for(String i : filelist){
                //파일개수만큼 돌면서 이미지엔티티에 이미지이름과,상품정보를 셋하고 디비에 저장
                ProductImage image = ProductImage.builder().fileName(i).product(result).build();
                imageRepository.save(image);

            }
        }

    }

    @Override
    public void updateProduct(ProductDTO dto) {
        //기존 파일명
        List<String> historyFileNames = imageRepository.findFileNamesByPNo(dto.getPno());
        //새로 업로드할 파일
        List<MultipartFile> files = dto.getFiles();
        //새로 업로드된 파일 이름들
        List<String> newUploadFileNames = fileUtil.saveFiles(files);
        //화면에서 변화없이 유지된 파일들
        List<String> uploadFileNames = dto.getUploadFileNames();
        //유지되는 파일과 새로 업로드된 파일 목록
        if(newUploadFileNames != null && newUploadFileNames.size()>0){
            uploadFileNames.addAll(newUploadFileNames);
        }

        //변경된 상품정보 업데이트
        Product modifyProduct = modelMapper.map(dto,Product.class);
        Product result = productRepository.save(modifyProduct);

        if(historyFileNames != null && historyFileNames.size()>0){
            //기존파일 중에서 지워야할 파일 찾아서 지우기
            List<String> removeFiles = historyFileNames.stream().filter(i->uploadFileNames.indexOf(i)==-1).collect(Collectors.toList());
            fileUtil.deleteFiles(removeFiles);
        }

        for(String i : uploadFileNames){
            //기존이미지 자리에 새로운 이미지로 바꿀때
            if(!historyFileNames.isEmpty()) {
                Long imgNo = imageRepository.findImageNoByFilename(historyFileNames.get(0));
                ProductImage productImage = imageRepository.findById(imgNo).orElseThrow();
                productImage.setFileName(i);
                imageRepository.save(productImage);
            }else {
                //기존이미지가 없고 새로운이미지만 추가할때
                ProductImage newProductImage = ProductImage.builder().fileName(i).product(result).build();
                imageRepository.save(newProductImage);
            }

        }
        //새로 추가한파일은 없고 기존에 있떤  이미지를 디비에 상품 이미지 테이블에서 삭제할때
        if(uploadFileNames.isEmpty()){
            //db에 상품에대한 이미지가없고 새로 추가한이미지도없으면 예외가 발생하기때문에 if문을 하나 추가하여서 예외처리함
            if (historyFileNames != null && !historyFileNames.isEmpty()){
                Long imgNo2 = imageRepository.findImageNoByFilename(historyFileNames.get(0));
                imageRepository.deleteById(imgNo2);
            }
        }

    }

    @Override
    @Transactional
    public void removeProduct(Long pno) {
        List<String> imglist = imageRepository.findFileNamesByPNo(pno);
        productRepository.deleteById(pno);
        if(!imglist.isEmpty()){
            fileUtil.deleteFiles(imglist);
        }

    }
    @Transactional
    @Override
    public String addConcert(ConcertDTO concertDTO) {
        List<ConcertSchedule> concertScheduleList = new ArrayList<>();
        Concert concert = Concert.builder()
                .cName(concertDTO.getCname())
                .cPlace(concertDTO.getCplace())
                .cdesc(concertDTO.getCdesc())
                .cPrice(concertDTO.getCprice())
                .category(concertDTO.getCategory())
                .build();
        for (ConcertScheduleDTO i : concertDTO.getSchedulesDtoList()) {
            ConcertSchedule schedule = new ConcertSchedule();
            schedule.setConcert(concert);
            schedule.setStartTime(i.getStartTime());
            schedule.setEndTime(i.getEndTime());
            schedule.setTotalSeats(i.getTotalSeats());
            schedule.setStatus(ConcertStatus.AVAILABLE);
            concertScheduleList.add(schedule);
        }
        concert.setSchedules(concertScheduleList);
        Concert result = concertRepository.save(concert);
        if (concertDTO.getFile()!=null) {
            String filename = concertFileUtil.saveFiles(concertDTO.getFile());
            ConcertImage image = ConcertImage.builder().fileName(filename).concert(result).build();
            concertImageRepository.save(image);
        }
        return "공연추가 완료";
     }

    @Transactional
    @Override
    public String updateConcert(ConcertDTO concertDTO) {
        System.out.println(concertDTO);
        System.out.println("서비스까지는 넘어옴");
        // 디비에 있는 기존 이미지파일 이름
        String historyFileName = concertImageRepository.findFileNameByCNo(concertDTO.getCno());
        System.out.println("기존 이미지 파일 가져옴");
        // 새로 업로드할 파일
        MultipartFile newfile = concertDTO.getFile();
        // 새로 업로드하는 파일 이름
        String newUploadFileName = concertFileUtil.saveFiles(newfile);

        // 공연번호에 해당하는 스케줄 전부 삭제
        scheduleRepository.deleteScheduleByCno(concertDTO.getCno());
        System.out.println("스케줄삭제부분까지는 진행");
        // 수정할 콘서트 엔티티 작성
        Concert modifyConcert = concertRepository.findById(concertDTO.getCno())
                .orElseThrow(() -> new RuntimeException("Concert not found"));
        System.out.println("새로저장할 스케줄 리스트생성에서 오류가났니?");
        modifyConcert.setCName(concertDTO.getCname());
        modifyConcert.setCPrice(concertDTO.getCprice());
        modifyConcert.setCdesc(concertDTO.getCdesc());
        modifyConcert.setCPlace(concertDTO.getCplace());
        modifyConcert.setCategory(concertDTO.getCategory());

        // 새로운 스케줄 추가
        List<ConcertSchedule> newScheduleList = new ArrayList<>();
        for (ConcertScheduleDTO i : concertDTO.getSchedulesDtoList()) {
            ConcertSchedule schedule = new ConcertSchedule();
            schedule.setStartTime(i.getStartTime());
            schedule.setEndTime(i.getEndTime());
            schedule.setTotalSeats(i.getTotalSeats());
            schedule.setStatus(i.getStatus());
            schedule.setConcert(modifyConcert);
            newScheduleList.add(schedule);
            System.out.println("새로운 스케줄 생성 했음");
        }

        modifyConcert.setSchedules(newScheduleList);

        concertRepository.save(modifyConcert);
        System.out.println("변경된 콘서트정보와 콘서트스케줄을 저장했음");
        // 새로 추가하는 이미지가 있을때
        if (newUploadFileName != null && !newUploadFileName.isEmpty()) {
            System.out.println("새로추가할이미지가 있어서 들어옴");
            if (historyFileName == null || historyFileName.isEmpty()) {
                System.out.println("기존파일없는부분까지는 함");
                // 기존파일은 없는경우 새로 추가
                concertImageRepository.save(ConcertImage.builder()
                        .concert(modifyConcert)
                        .fileName(newUploadFileName)
                        .build());
            } else {
                System.out.println("기존파일있는부분까지는 함");
                // 기존 파일이 있을 경우 디비에서 파일이름 수정 후 원래 있던 실제파일 삭제
                concertImageRepository.updateFileNameByCno(newUploadFileName, modifyConcert.getCNo());
                concertFileUtil.deleteFiles(historyFileName);
            }
        }

        //새로 업로드할 파일은 없고 기존에 있던 이미지파일은 삭제해야할때
        if(concertDTO.getUploadFileName() == null && historyFileName !=null && newUploadFileName == null){
            System.out.println("업로드없고 기존파일삭제부분");
                concertImageRepository.deleteImgInfoByCno(concertDTO.getCno());
                concertFileUtil.deleteFiles(historyFileName);

        }

        return "공연 정보 업데이트가 완료되었습니다.";
    }

    @Override
    public void removeConcert(Long cno) {
        concertRepository.deleteById(cno);
    }

    @Override
    public List<AdminProductDTO> getProductList() {

        return productRepository.findAll().stream().map(i ->{
           AdminProductDTO adminProductDTO = new AdminProductDTO();
           adminProductDTO.setPno(i.pNo());
           adminProductDTO.setPname(i.pName());
           adminProductDTO.setPrice(i.pPrice());
           adminProductDTO.setCategory(i.category());

           String imgFileName = imageRepository.findFileNamesByPNo(i.pNo()).stream().findFirst().orElse("");
           adminProductDTO.setImgFileName(imgFileName);

            return adminProductDTO;
        }).toList();
    }

    @Override
    public ProductDTO getProductByPno(Long pno) {
        Product result = productRepository.findById(pno).orElse(null);

        ProductDTO productDTO = modelMapper.map(result,ProductDTO.class);
        productDTO.setUploadFileNames(imageRepository.findFileNamesByPNo(pno));
        return productDTO;
    }

    @Override
    public List<AdminConcertDTO> getConcertList() {
        return concertRepository.findAll().stream().map(i->{
            AdminConcertDTO concertDTO = new AdminConcertDTO();
            concertDTO.setCno(i.getCNo());
            concertDTO.setCname(i.getCName());
            concertDTO.setCprice(i.getCPrice());
            concertDTO.setCategory(i.getCategory());
            concertDTO.setImgFileName(concertImageRepository.findFileNameByCNo(i.getCNo()));
            return concertDTO;
        }).toList();
    }

    @Override
    public ConcertDTO getConcertByCno(Long cno) {
       Concert concert = concertRepository.findById(cno).orElse(null);
        return ConcertDTO.builder()
                .cno(concert.getCNo())
                .cname(concert.getCName())
                .cplace(concert.getCPlace())
                .cdesc(concert.getCdesc())
                .cprice(concert.getCPrice())
                .category(concert.getCategory())
                .uploadFileName(concertImageRepository.findFileNameByCNo(concert.getCNo()))
                .schedulesDtoList( scheduleRepository.getScheduleByCno(concert.getCNo()).stream().map(i->{
                    ConcertScheduleDTO scheduleDTO = new ConcertScheduleDTO();
                    scheduleDTO.setScheduleId(i.getScheduleId());
                    scheduleDTO.setStartTime(i.getStartTime());
                    scheduleDTO.setEndTime(i.getEndTime());
                    scheduleDTO.setTotalSeats(i.getTotalSeats());
                    scheduleDTO.setStatus(i.getStatus());
                    return scheduleDTO;
                }).toList())
                .build();
    }


}
