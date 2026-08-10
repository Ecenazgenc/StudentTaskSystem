package com.example.student_task_system.config;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class XssSanitizerUtils {

    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern SRC_PATTERN = Pattern.compile("src[\r\n]*=[\r\n]*['\"]*(.*?)['\"]*", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern EVAL_PATTERN = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);

    public static String sanitize(String input) {
        if (input == null) return null;

        String clean = input;
        clean = SCRIPT_PATTERN.matcher(clean).replaceAll("");
        clean = SRC_PATTERN.matcher(clean).replaceAll("");
        clean = EVAL_PATTERN.matcher(clean).replaceAll("");
        clean = clean.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        clean = clean.replaceAll("(?i)javascript:", "");

        return clean.trim();
    }
}
