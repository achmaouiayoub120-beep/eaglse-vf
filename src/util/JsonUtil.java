package util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Utility class for JSON operations using Gson.
 */
public class JsonUtil {
    private static final Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .registerTypeAdapter(java.time.LocalDate.class, new com.google.gson.JsonDeserializer<java.time.LocalDate>() {
                @Override
                public java.time.LocalDate deserialize(com.google.gson.JsonElement json, java.lang.reflect.Type typeOfT, com.google.gson.JsonDeserializationContext context) throws com.google.gson.JsonParseException {
                    return java.time.LocalDate.parse(json.getAsString());
                }
            })
            .registerTypeAdapter(java.time.LocalDate.class, new com.google.gson.JsonSerializer<java.time.LocalDate>() {
                @Override
                public com.google.gson.JsonElement serialize(java.time.LocalDate src, java.lang.reflect.Type typeOfSrc, com.google.gson.JsonSerializationContext context) {
                    return new com.google.gson.JsonPrimitive(src.toString());
                }
            })
            .create();

    public static String toJson(Object obj) {
        return gson.toJson(obj);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }

    public static void saveToFile(String filePath, String content) throws IOException {
        Files.createDirectories(Paths.get(filePath).getParent());
        Files.write(Paths.get(filePath), content.getBytes());
    }

    public static String readFromFile(String filePath) throws IOException {
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    public static boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
}
