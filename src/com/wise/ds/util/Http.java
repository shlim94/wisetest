package com.wise.ds.util;

import java.io.File;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Map;
 
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.ibm.db2.jcc.am.SqlException;


public class Http {
    private static final String DEFAULT_ENCODING = "UTF-8";
     
    private String url;
    private MultipartEntityBuilder params;
     
    /**
     * @param url 접속할 url
     */
    public Http(String url){
        this.url = url;
         
        params = MultipartEntityBuilder.create();
    }
     
    /**
     * Map 으로 한꺼번에 파라메터 훅 추가하는 메소드
     * @param param 파라메터들이 담긴 맵, 파라메터들은 UTF-8로 인코딩 됨
     * @return
     */
    public Http addParam(Map<String, Object> param){
        return addParam(param, DEFAULT_ENCODING);
    }
     
    /**
     * Map 으로 한꺼번에 파라메터 훅 추가하는 메소드
     * @param param 파라메터들이 담긴 맵
     * @param encoding 파라메터 encoding charset
     * @return
     */
    public Http addParam(Map<String, Object> param, String encoding){
        for(Map.Entry<String, Object> e : param.entrySet() ){
            if (e.getValue() instanceof File) {
                addParam(e.getKey(), (File)e.getValue(), encoding);
            }else{
                addParam(e.getKey(), (String)e.getValue(), encoding);
            }
        }
        return this;
    }
     
    /**
     * 문자열 파라메터를 추가한다.
     * @param name 추가할 파라메터 이름
     * @param value 파라메터 값
     * @return
     */
    public Http addParam(String name, String value){
        return addParam(name, value, DEFAULT_ENCODING);
    }
     
    public Http addParam(String name, String value, String encoding){
        params.addPart(name, new StringBody(value, ContentType.create("text/plain", encoding)));
         
        return this;
    }
     
    /**
     * 업로드할 파일 파라메터를 추가한다.
     * @param name
     * @param file
     * @return
     */
    public Http addParam(String name, File file){
        return addParam(name, file, DEFAULT_ENCODING);
    }
     
    public Http addParam(String name, File file, String encoding){
        if( file.exists() ){
            try{
                params.addPart(
                        name,
                        new FileBody(file, ContentType.create("application/octet-stream"),
                        URLEncoder.encode(file.getName(), encoding)));
            }catch( UnsupportedEncodingException ex ){ ex.printStackTrace(); }
             
        }
         
        return this;
    }
 
    /**
     * 타겟 URL 로 POST 요청을 보낸다.
     * @return 요청결과
     */
    public String submit() {
        CloseableHttpClient http = HttpClients.createDefault();
        StringBuffer result = new StringBuffer();
         
        try{
            HttpPost post = new HttpPost(url);
            post.setEntity(params.build());
             
            CloseableHttpResponse response = http.execute(post);
             
            try{
                HttpEntity res = response.getEntity();
                BufferedReader br = new BufferedReader(
                                    new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
                 
                String buffer = null;
                while( (buffer=br.readLine())!=null ){
                    result.append(buffer).append("\r\n");
                }
            } catch (IOException ie) {
            	ie.printStackTrace();
            } finally {
            	if (response != null) {
            		try {
            			response.close();
            		} catch (IOException se) {
            			se.printStackTrace();
            			response = null;
            		}
            	}
            }
        } catch (IOException e) {
        	e.printStackTrace();
        } finally{
        	if (http != null) {
        		try {
        			http.close();
        		} catch (IOException se) {
        			se.printStackTrace();
        			http = null;
        		}
        	}
        }
 
        return result.toString();
    }
     
}
