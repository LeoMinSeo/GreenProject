package com.green.project.Leo.service.Admin;

import com.green.project.Leo.dto.product.OrderItemDTO;
import com.green.project.Leo.dto.product.ProductDTO;
import com.green.project.Leo.dto.product.ProductOrderDTO;
import com.green.project.Leo.entity.User;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.repository.product.OrderItemRepository;
import com.green.project.Leo.repository.product.ProductImageRepository;
import com.green.project.Leo.repository.product.ProductOrderRepository;
import com.green.project.Leo.repository.product.ProductRepository;
import com.green.project.Leo.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private final OrderItemRepository orderItemRepository;
    private final ProductOrderRepository orderRepository;
    @Override
    public void addProduct(ProductDTO dto) {

        //상품정보 저장 엔티티로
        Product product = Product.builder()
                .pName(dto.getPname())
                .pdesc(dto.getPdesc())
                .pPrice(dto.getPrice())
                .pStock(dto.getPstock())
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



}
