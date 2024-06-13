import { supabase } from "@/lib/supabase";
import { TableType } from "@/types/types";

export type Student = TableType<"student">;

export const createStudent = async (studentData: Partial<Student>) => {
  const { data, error } = await supabase
    .from("student")
    .insert(studentData)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const editStudent = async (
  student_uid: number,
  studentData: Partial<Omit<Student, "student_uid">>
) => {
  const { data, error } = await supabase
    .from("student")
    .update(studentData)
    .eq("student_uid", student_uid)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const listStudents = async (filter?: Partial<Student>) => {
  let query = supabase.from("student").select("*");

  if (filter) {
    Object.keys(filter).forEach((key) => {
      query = query.eq(key, (filter as any)[key]);
    });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const showStudent = async (student_uid: number) => {
  const { data, error } = await supabase
    .from("student")
    .select("*")
    .eq("student_uid", student_uid)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteStudent = async (student_uid: number) => {
  const { data, error } = await supabase
    .from("student")
    .delete()
    .eq("student_uid", student_uid)
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const duplicateStudent = async (student_uid: number) => {
  const { data: originalData, error: fetchError } = await supabase
    .from("student")
    .select("*")
    .eq("student_uid", student_uid)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { data: newData, error: insertError } = await supabase
    .from("student")
    .insert({ ...originalData, student_uid: undefined })
    .select("*");
  if (insertError) throw new Error(insertError.message);

  return newData;
};

export const searchStudents = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from("student")
    .select("*")
    .ilike("student_name", `%${searchTerm}%`);
  if (error) throw new Error(error.message);
  return data;
};

export const getStudentsByCourse = async (student_course: string) => {
  const { data, error } = await supabase
    .from("student")
    .select("*")
    .eq("student_course", student_course);
  if (error) throw new Error(error.message);
  return data;
};

export const getStudentsByYear = async (student_year: number) => {
  const { data, error } = await supabase
    .from("student")
    .select("*")
    .eq("student_year", student_year);
  if (error) throw new Error(error.message);
  return data;
};

export const getStudentsByDateRange = async (
  start_date: string,
  end_date: string
) => {
  const { data, error } = await supabase
    .from("student")
    .select("*")
    .gte("date_registered", start_date)
    .lte("date_registered", end_date);
  if (error) throw new Error(error.message);
  return data;
};
