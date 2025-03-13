package com.green.project.Leo.service.product;

import com.green.project.Leo.dto.UserDTO;
import com.green.project.Leo.dto.pageable.PageRequestDTO;
import com.green.project.Leo.dto.pageable.PageResponseDTO;
import com.green.project.Leo.dto.product.*;
import com.green.project.Leo.entity.User;
import com.green.project.Leo.entity.product.*;
import com.green.project.Leo.repository.UserRepository;
import com.green.project.Leo.repository.product.*;
import com.green.project.Leo.util.CustomFileUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceIplm implements ProductService{
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomFileUtil fileUtil;
    @Autowired
    private ProductImageRepository imageRepository;
    @Autowired
    private ProductReviewRatingRepository reviewRatingRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductCartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductReviewRepository reviewRepository;


    @Override
    public ProductReviewRatingDTO selectReview(Long pno) {
        Optional<ProductReviewRating> result = reviewRatingRepository.reviewRatingByPno(pno);
        System.out.println(result.orElseThrow());
        ProductReviewRating rating = result.orElseThrow();
        return new ProductReviewRatingDTO(rating.getPNo(),rating.getAvgRating(),rating.getReviewCount());
    }

    @Override
    public PageResponseDTO<ProductDTO> getProductList(PageRequestDTO dto) {

        Pageable pageable = PageRequest.of(
                dto.getPage()-1,
                dto.getSize(),
                Sort.by("pNo").descending()
        );
        Page<Product> result = productRepository.findAll(pageable);
        List<ProductDTO> productDTOList = new ArrayList<>();
        for(Product i : result){
            List<String> imageList = imageRepository.findFileNamesByPNo(i.pNo());
            ProductDTO productDTO = ProductDTO.builder()
                    .pno(i.pNo())
                    .pname(i.pName())
                    .pdesc(i.pdesc())
                    .price(i.pPrice())
                    .pstock(i.pStock())
                    .uploadFileNames(imageList)
                    .build();
            productDTOList.add(productDTO);
        }
        long totalCount = result.getTotalElements();
        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(productDTOList)
                .totalCount(totalCount)
                .pageRequestDTO(dto)
                .build();
    }

    @Override
    public ProductReadDTO getProductByPno(Long pno) {
        Product result = productRepository.findById(pno).orElseThrow();
        List<String> imamgeList = imageRepository.findFileNamesByPNo(result.pNo());
        ProductReviewRating reviewrating = reviewRatingRepository.reviewRatingByPno(pno).orElse(null);
        ProductDTO productDTO = ProductDTO.builder()
                .pno(result.pNo())
                .pname(result.pName())
                .price(result.pPrice())
                .pdesc(result.pdesc())
                .pstock(result.pStock())
                .uploadFileNames(imamgeList)
                .build();
        if (reviewrating == null) {
            ProductReviewRatingDTO reviewDTO = ProductReviewRatingDTO.builder()
                    .pno(0L)
                    .reviewcount(0)
                    .avgrating((double) 0)
                    .build();
            return ProductReadDTO.builder().reviewRatingDTO(reviewDTO).productDTO(productDTO).build();
        }else {
            ProductReviewRatingDTO reviewDTO = ProductReviewRatingDTO.builder()
                    .pno(reviewrating.getPNo())
                    .reviewcount(reviewrating.getReviewCount())
                    .avgrating(reviewrating.getAvgRating())
                    .build();
            return ProductReadDTO.builder().reviewRatingDTO(reviewDTO).productDTO(productDTO).build();
        }
    }





    @Override
    public List<ProductCartDTO> getCartList(String userId) {
        List<ProductCart> result = cartRepository.selectCartByUserId(userId);
        List<ProductCartDTO> cartDTOList = new ArrayList<>();
        for (ProductCart i : result){
            //상품 이미지가져와서 상품정보,이미지 dto로 변환 (모델맵퍼로 하려고했지만 상품에 해당하는 이미지를 조회해서 가져와야해가지고 빌더로 세팅)
            List<String> imageList = imageRepository.findFileNamesByPNo(i.getProduct().pNo());
            ProductDTO productDTO = ProductDTO.builder()
                    .price(i.getProduct().pPrice())
                    .pname(i.getProduct().pName())
                    .pno(i.getProduct().pNo())
                    .pdesc(i.getProduct().pdesc())
                    .pstock(i.getProduct().pStock())
                    .uploadFileNames(imageList != null
                            ? imageList
                            : new ArrayList<>())
                    .build();

            //카트dto에 엔티티타입인것 변환하고 user,product세팅
           ProductCartDTO cartDTO = ProductCartDTO.builder()
                    .cartNo(i.getCartNo())
                    .userDTO(modelMapper.map(i.getUser(),UserDTO.class))
                    .productDTO(productDTO)
                    .numofItem(i.getNumOfItem())
                    .build();
            cartDTOList.add(cartDTO);
        }
        return cartDTOList;
    }

    @Override
    public List<ResponseProductReviewDTO> getReview(Long pno) {
        List<ProductReview> reviewList = reviewRepository.selectByPNo(pno);
        List<ResponseProductReviewDTO> reviewDTOList = new ArrayList<>();
        for(ProductReview i: reviewList){
            ResponseProductReviewDTO dto = ResponseProductReviewDTO.builder()
                    .proReivewNo(i.getPReivewNo())
                    .reviewRating(i.getReviewRating())
                    .userId(i.getUser().userId())
                    .reviewtext(i.getReviewtext())
                    .dueDate(i.getDueDate())
                    .build();
            reviewDTOList.add(dto);
        }
       return reviewDTOList;
    }


}
