package com.example.ex05;

import android.app.AlertDialog;
import android.os.AsyncTask;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.os.TestLooperManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewPropertyAnimator;
import android.widget.BaseAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class BookFragment extends Fragment {
    String query="안드로이드";
    int page=1;
    boolean is_end = false;
    BookAdapter adapter = new BookAdapter();
    List<HashMap<String,Object>> array = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_blog, container, false);
        new BookThread().execute();

        ListView list = view.findViewById(R.id.list);
        list.setAdapter(adapter);

        EditText edtQuery = view.findViewById(R.id.query);

        view.findViewById(R.id.search).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                query = edtQuery.getText().toString();
                page=1;
                array = new ArrayList<>();
                new BookThread().execute();
            }
        });

        view.findViewById(R.id.more).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(is_end) {
                    Toast.makeText(getActivity(), "마지막 페이지입니다.", Toast.LENGTH_SHORT).show();
                } else {
                    page += 1;
                    new BookThread().execute();
                }
            }
        });
        return view;
    }

    //Book 쓰레드
    class BookThread extends AsyncTask<String, String, String>{

        @Override
        protected String doInBackground(String... strings) {
            String url="https://dapi.kakao.com/v3/search/book?target=title&query=" + query + "&page=" + page;
            String result = KakaoAPI.connect(url);
            return result;
        }

        @Override
        protected void onPostExecute(String s) {
            bookParser(s);
            adapter.notifyDataSetChanged();
            super.onPostExecute(s);
        }
    }
    //도서 파싱
    public void bookParser(String result){
        try {
            JSONObject meta = new JSONObject(result).getJSONObject("meta");
            is_end = meta.getBoolean("is_end");
            JSONArray jArray = new JSONObject(result).getJSONArray("documents");
            for(int i=0; i<jArray.length(); i++){
                JSONObject obj = jArray.getJSONObject(i);
                HashMap<String, Object> map = new HashMap<>();
                map.put("title", obj.getString("title"));
                map.put("price", obj.getString("price"));
                map.put("image", obj.getString("thumbnail"));
                map.put("contents", obj.getString("contents"));
                map.put("authors", obj.getString("authors"));
                array.add(map);
            }
        }catch (Exception e){
            System.out.println("파싱오류 : " + e.toString());
        }
    }

    class BookAdapter extends BaseAdapter {

        @Override
        public int getCount() {
            return array.size();
        }

        @Override
        public Object getItem(int position) {
            return null;
        }

        @Override
        public long getItemId(int position) {
            return 0;
        }

        @Override
        public View getView(int position, View view, ViewGroup parent) {
            view = getLayoutInflater().inflate(R.layout.item_book, parent, false);
            HashMap<String, Object> map = array.get(position);
            ImageView image = view.findViewById(R.id.image);
            String strImage = map.get("image").toString();
            if(strImage.equals("")) {
                image.setImageResource(R.drawable.baseline_article_24);
            } else {
                Picasso.with(getActivity())
                        .load(strImage)
                        .into(image);
            }

            TextView title = view.findViewById(R.id.title);
            String strTitle = map.get("title").toString();
            title.setText(strTitle);

            TextView price = view.findViewById(R.id.price);
            String strPrice = map.get("price").toString();
            int intPrice = Integer.parseInt(strPrice);
            DecimalFormat df = new DecimalFormat("#,###원");
            price.setText(df.format(intPrice));

            TextView authors = view.findViewById(R.id.authors);
            String strAuthors = map.get("authors").toString();
            authors.setText(strAuthors);

            String strContent = map.get("contents").toString();
            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View layout = getLayoutInflater().inflate(R.layout.item_contents, parent, false);

                    ImageView image = layout.findViewById(R.id.image);
                    if(strImage.equals("")) {
                        image.setImageResource(R.drawable.baseline_article_24);
                    } else {
                        Picasso.with(getActivity())
                                .load(strImage)
                                .into(image);
                    }

                    TextView contents = layout.findViewById(R.id.contents);
                    contents.setText(strContent);

                    new AlertDialog.Builder(getActivity())
                            .setTitle("도서 내용")
                            .setView(layout)
                            .setPositiveButton("확인", null)
                            .show();
                }
            });
            return view;
        }
    }
}