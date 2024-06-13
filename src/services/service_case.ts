import { supabase } from "@/lib/supabase";
import { TableType } from "@/types/types";

export type Cases = TableType<"cases">;

export const createCase = async (caseData: Omit<Cases, "case_id">) => {
  const { data, error } = await supabase
    .from("cases")
    .insert(caseData)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const editCase = async (
  case_id: number,
  caseData: Partial<Omit<Cases, "case_id">>
) => {
  const { data, error } = await supabase
    .from("cases")
    .update(caseData)
    .eq("case_id", case_id)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const listCases = async (filter?: Partial<Cases>) => {
  let query = supabase.from("cases").select("*");

  if (filter) {
    Object.keys(filter).forEach((key) => {
      query = query.eq(key, (filter as any)[key]);
    });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const showCase = async (case_id: number) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_id", case_id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCase = async (case_id: number) => {
  const { data, error } = await supabase
    .from("cases")
    .delete()
    .eq("case_id", case_id)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const duplicateCase = async (case_id: number) => {
  const { data: originalData, error: fetchError } = await supabase
    .from("cases")
    .select("*")
    .eq("case_id", case_id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { data: newData, error: insertError } = await supabase
    .from("cases")
    .insert({ ...originalData, case_id: undefined })
    .select("*");
  if (insertError) throw new Error(insertError.message);

  return newData;
};

export const searchCases = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .ilike("case_title", `%${searchTerm}%`);
  if (error) throw new Error(error.message);
  return data;
};

export const getCasesByStatus = async (case_status: number) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_status", case_status);
  if (error) throw new Error(error.message);
  return data;
};

export const getCasesByUploader = async (case_uploader_id: number) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_uploader_id", case_uploader_id);
  if (error) throw new Error(error.message);
  return data;
};

export const getCasesByDateRange = async (
  start_date: string,
  end_date: string
) => {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .gte("case_date_time", start_date)
    .lte("case_date_time", end_date);
  if (error) throw new Error(error.message);
  return data;
};
